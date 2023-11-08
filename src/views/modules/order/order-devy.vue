<template>
  <el-dialog
    v-model:visible="visible"
    :modal="false"
    title="选择发货地址"
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
      <el-form-item label="快递公司">
        <el-select
          v-model="dataForm.dvyId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dataForm.dvyNames"
            :key="item.dvyId"
            :label="item.dvyName"
            :value="item.dvyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="快递单号"
        prop="dvyFlowId"
      >
        <el-input
          v-model="dataForm.dvyFlowId"
          controls-position="right"
          :min="0"
          label="快递单号"
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

  emits: ['refreshDataList'],


var visible = ref(false)
var dataForm = reactive({
  dvyId: '',
  dvyFlowId: 0,
  dvyNames: [],
  orderNumber: 0
})
var dataRule = {
  dvyFlowId: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { validator: validDvyFlowId, trigger: 'blur' }
  ]
}


const init  = (orderNumber, dvyId, dvyFlowId) => {
  visible = true
  dataForm.orderNumber = orderNumber || ''
  dataForm.dvyId = dvyId || ''
  dataForm.dvyFlowId = dvyFlowId || ''
  http({
    url: http.adornUrl('/admin/delivery/list'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    dataForm.dvyNames = data
  })
}
// 表单提交
const onSubmit  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/order/order/delivery'),
        method: 'put',
        data: http.adornData({
          orderNumber: dataForm.orderNumber,
          dvyId: dataForm.dvyId,
          dvyFlowId: dataForm.dvyFlowId
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
}

</script>
