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
        label="公告标题"
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
            公布
          </el-radio>
          <el-radio :label="0">
            撤销
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="置顶"
        prop="isTop"
      >
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="1">
            是
          </el-radio>
          <el-radio :label="0">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="公告内容"
        prop="content"
      >
        <tiny-mce v-model="dataForm.content" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span
        class="dialog-footer"
      >
        <el-button
          
          @click="visible = false"
        >取消</el-button>
        <el-button
          
          type="primary"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import TinyMce from '@/components/tiny-mce'
import { Debounce } from '@/utils/debounce'


  emits: ['refreshDataList'],


var visible = ref(false)
var roleList = ref([])
var dataForm = reactive({
  title: null,
  content: null,
  url: null,
  status: 1,
  isTop: 0
})
var dataRule = {
  title: [
    { required: true, message: '公告标题不能为空', trigger: 'blur' },
    { validator: validateTitle, trigger: 'blur' }
  ]
}


const init  = (id) => {
  dataForm.id = id || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.id) {
      http({
        url: http.adornUrl('/shop/notice/info/' + dataForm.id),
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
        url: http.adornUrl('/shop/notice'),
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
            dataForm.content = ''
          }
        })
      })
    }
  })
})

</script>
