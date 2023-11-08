<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.userId ? '新增' : '修改'"
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
        label="用户头像"
        prop="pic"
      >
        <img
          :src="dataForm.pic"
          class="image"
        >
      </el-form-item>
      <el-form-item
        label="用户昵称"
        prop="nickName"
      >
        <el-input
          v-model="dataForm.nickName"
          :disabled="true"
          placeholder="用户昵称"
        />
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
      <span
        class="dialog-footer"
      >
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
import { Debounce } from '@/utils/debounce'

  emits: ['refreshDataList'],


var visible = ref(false)
var dataForm = reactive({
  userId: 0,
  nickName: '',
  pic: '',
  status: 1
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
var dataRule = {
  nickName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ]
}


const init  = (id) => {
  dataForm.userId = id || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
  if (dataForm.userId) {
    http({
      url: http.adornUrl(`/admin/user/info/${dataForm.userId}`),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      dataForm = data
    })
  }
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      http({
        url: http.adornUrl('/admin/user'),
        method: dataForm.userId ? 'put' : 'post',
        data: http.adornData({
          userId: dataForm.userId || undefined,
          nickName: dataForm.nickName,
          status: dataForm.status
        })
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            emit('refreshDataList', page)
          }
        })
      })
    }
  })
})

</script>
