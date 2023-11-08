<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      v-model:visible="visible"
      :title="!dataForm.hotSearchId ? '新增' : '修改'"
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
          label="标题"
          prop="title"
        >
          <el-input
            v-model="dataForm.title"
            controls-position="right"
            :min="0"
            maxlength="50"
            show-word-limit
            label="标题"
          />
        </el-form-item>

        <el-form-item
          label="内容"
          prop="content"
        >
          <el-input
            v-model="dataForm.content"
            controls-position="right"
            type="textarea"
            :min="0"
            maxlength="255"
            show-word-limit
            label="内容"
          />
        </el-form-item>
        <el-form-item
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
  </div>
</template>

<script setup>
import { Debounce } from '@/utils/debounce'


  emits: ['refreshDataList'],


var dataForm = reactive({
  hotSearchId: 0,
  title: '',
  content: '',
  recDate: '',
  seq: 0,
  status: 0
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var addProdVisible = ref(false)
var visible = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
var dataRule = {
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在1到50个字符内', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '标题不能为空', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { min: 1, max: 255, message: '长度在1到255个字符内', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '内容不能为空', trigger: 'blur' }
  ]
}


const init  = (id) => {
  dataForm.hotSearchId = id || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.hotSearchId) {
      http({
        url: http.adornUrl('/admin/hotSearch/info/' + dataForm.hotSearchId),
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
  dataFormRef.value?.validate(valid => {
    if (valid) {
      const param = dataForm
      http({
        url: http.adornUrl('/admin/hotSearch'),
        method: param.hotSearchId ? 'put' : 'post',
        data: http.adornData(param)
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
