<template>
  <el-dialog
    v-model:visible="visible"
    title="修改"
    :modal="false"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        v-if="dataForm.type !== 2"
        label="排序号"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          label="排序号"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        size="mini"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            下线
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
import { Debounce } from '@/utils/debounce'

  emits: ['refreshDataList'],


var visible = ref(false)
var dataForm = {
  addrOrderId: 0,
  receiver: '',
  province: '',
  mobile: ''
}


const init  = (addrOrderId) => {
  dataForm.addrOrderId = addrOrderId
  http({
    url: http.adornUrl(`/prod/category/listCategory/${dataForm.addrOrderId}`),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    dataForm = data
  }).then(() => {
    visible = true
    nextTick(() => {
      dataFormRef.value?.resetFields()
    })
  })
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/prod/category'),
        method: dataForm.currentId ? 'put' : 'post',
        data: http.adornData({
          categoryId: dataForm.currentId || undefined
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
