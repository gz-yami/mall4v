<template>
  <el-dialog
    v-model:visible="visible"
    title="修改密码"
    :append-to-body="true"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item
        label="原密码"
        prop="password"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPassword"
      >
        <el-input
          v-model="dataForm.newPassword"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPassword"
      >
        <el-input
          v-model="dataForm.confirmPassword"
          type="password"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { clearLoginInfo } from '@/utils'
import { Debounce } from '@/utils/debounce'
import { encrypt } from '@/utils/crypto'


var visible = ref(false)
var dataForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})
var dataRule = {
  password: [
    { required: true, message: '原密码不能为空', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}
  computed: {
    userName: {
      get () { return $store.state.user.name }
    },
    mainTabs: {
      get () { return $store.state.common.mainTabs },
      set (val) { $store.commit('common/updateMainTabs', val) }
    }
  },

// 初始化
const init  = () => {
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/sys/user/password'),
        method: 'post',
        data: http.adornData({
          password: encrypt(dataForm.password),
          newPassword: encrypt(dataForm.newPassword)
        })
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            nextTick(() => {
              mainTabs = []
              clearLoginInfo()
              useRouter().replace({ name: 'login' })
            })
          }
        })
      })
    }
  })
})

</script>
