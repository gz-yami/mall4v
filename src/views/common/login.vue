<template>
  <div class="login">
    <div class="login-box">
      <div class="top">
        <div class="logo">
          <img
            src="~@/assets/img/login-logo.png"
            alt=""
          >
        </div>
      </div>
      <div class="mid">
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="dataRule"
          status-icon
          @keyup.enter="onSubmit()"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="dataForm.userName"
              class="info"
              placeholder="帐号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="dataForm.password"
              class="info"
              type="password"
              placeholder="密码"
            />
          </el-form-item>
          <!-- <el-form-item prop="captcha">
            <el-row :gutter="20">
              <el-col :span="14">
                <el-input v-model="dataForm.captcha"
                          placeholder="验证码">
                </el-input>
              </el-col>
              <el-col :span="10"
                      class="login-captcha">
                <img :src="captchaPath"
                     @click="getCaptcha()"
                     alt="">
              </el-col>
            </el-row>
          </el-form-item> -->
          <el-form-item>
            <div class="item-btn">
              <input
                type="button"
                value="登录"
                @click="onSubmit()"
              >
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="bottom">
        Copyright © 2019 广州市蓝海创新科技有限公司
      </div>
    </div>
    <Verify
      ref="verifyRef"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="login"
    />
  </div>
</template>

<script setup>
import { getUUID } from '@/utils'
import Verify from '@/components/verifition/Verify'
import { encrypt } from '@/utils/crypto'


var dataForm = reactive({
  userName: '',
  password: '',
  uuid: '',
  captcha: ''
})
var dataRule = reactive({
  userName: [
    { required: true, message: '帐号不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '验证码不能为空', trigger: 'blur' }
  ]
})
var captchaPath = ref('')
  beforeUnmount () {
    document.removeEventListener('keyup', handerKeyup)
  },
onMounted(() => {
  getCaptcha()

  document.addEventListener('keyup', handerKeyup)
})

const handerKeyup  = (e) => {
  const keycode = document.all ? event.keyCode : e.which
  if (keycode === 13) {
    onSubmit()
  }
}
// 提交表单
const onSubmit  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      verifyRef.value?.show()
    }
  })
}
const login  = (verifyResult) => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  http({
    url: http.adornUrl('/adminLogin'),
    method: 'post',
    data: http.adornData({
      userName: dataForm.userName,
      passWord: encrypt(dataForm.password),
      captchaVerification: verifyResult.captchaVerification
    })
  }).then(({ data }) => {
    $cookie.set('Authorization', data.accessToken)
    useRouter().replace({ name: 'home' })
  }).catch(() => {
    isSubmit = false
  })
}
// onSubmit () {
//   $refs['dataForm'].validate((valid) => {
//     if (valid) {
//       http({
//         url: http.adornUrl('/login?grant_type=admin'),
//         method: 'post',
//         data: http.adornData({
//           'principal': dataForm.userName,
//           'credentials': dataForm.password,
//           'sessionUUID': dataForm.uuid,
//           'imageCode': dataForm.captcha
//         })
//       }).then(({ data }) => {
//         $cookie.set('Authorization', 'bearer' + data.access_token)
//         useRouter().replace({ name: 'home' })
//       }).catch(() => {
//         getCaptcha()
//       })
//     }
//   })
// },
// 获取验证码
const getCaptcha  = () => {
  dataForm.uuid = getUUID()
  captchaPath = http.adornUrl(`/captcha.jpg?uuid=${dataForm.uuid}`)
}

</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: url(~@/assets/img/login-bg.png) no-repeat;
  background-size: cover;
  position: fixed;
}
.login .login-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  padding-top: 10%;
}
.login .login-box .top {
  margin-bottom: 30px;
  text-align: center;
}
.login .login-box .top .logo {
  font-size: 0;
  max-width: 50%;
  margin: 0 auto;
}
.login .login-box .top .company {
  font-size: 16px;
  margin-top: 10px;
}
.login .login-box .mid {
  font-size: 14px;
}
.login .login-box .mid .item-btn {
  margin-top: 20px;
}
.login .login-box .mid .item-btn input {
  border: 0;
  width: 100%;
  height: 40px;
  box-shadow: 0;
  background: #1f87e8;
  color: #fff;
  border-radius: 3px;
}
.info {
  width: 410px;
}
.login-captcha {
  height: 40px;
}
.login .login-box .bottom {
  position: absolute;
  bottom: 10%;
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
}
</style>
