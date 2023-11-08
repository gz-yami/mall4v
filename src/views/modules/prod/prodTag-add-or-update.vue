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
        label="标签名称"
        :rules="[
          { required: true, message: '标签名称不能为空', trigger: 'blur' },
          { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的标签名称', trigger: 'blur' }
        ]"
        prop="title"
      >
        <el-input v-model="dataForm.title" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">
            正常
          </el-radio>
          <el-radio :label="0">
            禁用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="列表样式"
        prop="style"
      >
        <el-radio-group v-model="dataForm.style">
          <el-radio :label="0">
            一列一个
          </el-radio>
          <el-radio :label="1">
            一列两个
          </el-radio>
          <el-radio :label="2">
            一列三个
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="排序"
        prop="seq"
      >
        <!-- <el-input v-model="dataForm.seq"></el-input> -->
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          label="排序号"
        />
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
var roleList = ref([])
var dataForm = reactive({
  id: null,
  title: null,
  shopId: null,
  status: 1,
  isDefault: null,
  prodCount: null,
  seq: null,
  style: 0
})
var dataRule = {
}


const init  = (id) => {
  dataForm.id = id || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.id) {
      http({
        url: http.adornUrl('/prod/prodTag/info/' + dataForm.id),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm = data
      })
    }
  })
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/prod/prodTag'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData(dataForm)
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
