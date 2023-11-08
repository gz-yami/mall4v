<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="用户名"
        prop="userName"
      >
        <el-input
          v-model="dataForm.userName"
          placeholder="登录帐号"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="comfirmPassword"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.comfirmPassword"
          type="password"
          placeholder="确认密码"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="dataForm.email"
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
      >
        <el-input
          v-model="dataForm.mobile"
          maxlength="11"
          placeholder="手机号"
        />
      </el-form-item>
      <el-form-item
        label="角色"
        size="mini"
        prop="roleIdList"
      >
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
          >
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="状态"
        size="mini"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            禁用
          </el-radio>
          <el-radio :label="1">
            正常
          </el-radio>
        </el-radio-group>
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
import { isEmail, isMobile } from '@/utils/validate'
import { Debounce } from '@/utils/debounce'
import { encrypt } from '@/utils/crypto'

  emits: ['refreshDataList'],


var visible = ref(false)
var roleList = ref([])
var dataForm = reactive({
  id: 0,
  userName: '',
  password: '',
  comfirmPassword: '',
  email: '',
  mobile: '',
  roleIdList: [],
  status: 1
})
var dataRule = {
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的用户名', trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  comfirmPassword: [
    { validator: validateComfirmPassword, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ]
}


const init  = (id) => {
  dataForm.id = id || 0
  http({
    url: http.adornUrl('/sys/role/list'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    roleList = data
  }).then(() => {
    visible = true
    nextTick(() => {
      dataFormRef.value?.resetFields()
    })
  }).then(() => {
    if (dataForm.id) {
      http({
        url: http.adornUrl(`/sys/user/info/${dataForm.id}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm.userName = data.username
        dataForm.email = data.email
        dataForm.mobile = data.mobile
        dataForm.roleIdList = data.roleIdList
        dataForm.status = data.status
      })
    }
  })
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/sys/user'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData({
          userId: dataForm.id || undefined,
          username: dataForm.userName,
          password: encrypt(dataForm.password),
          email: dataForm.email,
          mobile: dataForm.mobile,
          status: dataForm.status,
          roleIdList: dataForm.roleIdList
        })
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
})

</script>
