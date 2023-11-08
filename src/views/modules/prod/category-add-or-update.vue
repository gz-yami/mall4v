<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.currentId ? '新增' : '修改'"
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
        v-if="dataForm.type !== 2"
        label="分类图片"
        prop="pic"
      >
        <pic-upload v-model="dataForm.pic" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="分类名称"
        prop="categoryName"
      >
        <el-input
          v-model="dataForm.categoryName"
          controls-position="right"
          :min="0"
          label="分类名称"
        />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-cascader
          v-model="selectedCategory"
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          change-on-select
          :clearable="true"
          @change="handleChange"
        />
      </el-form-item>
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
import { treeDataTranslate, idList } from '@/utils'
import PicUpload from '@/components/pic-upload'
import { Debounce } from '@/utils/debounce'


  emits: ['refreshDataList'],


var visible = ref(false)
var dataForm = reactive({
  categoryId: 0,
  currentId: 0,
  grade: 0,
  categoryName: '',
  seq: 1,
  status: 1,
  parentId: 0,
  pic: ''
})
var dataRule = reactive({
  categoryName: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的分类名称', trigger: 'blur' }
  ],
  pic: [
    { required: true, message: '分类图片不能为空', trigger: 'blur' }
  ]
})
var categoryList = ref([])
var selectedCategory = ref([])
var categoryTreeProps = reactive({
  value: 'categoryId',
  label: 'categoryName'
})
var isSubmit = ref(false)


const init  = (id) => {
  dataForm.currentId = id || 0
  dataForm.categoryId = id || 0
  http({
    url: http.adornUrl('/prod/category/listCategory'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
  }).then(() => {
    visible = true
    nextTick(() => {
      dataFormRef.value?.resetFields()
      selectedCategory = []
    })
  }).then(() => {
    if (dataForm.categoryId) {
      // 修改
      http({
        url: http.adornUrl(`/prod/category/info/${dataForm.categoryId}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm.categoryId = data.categoryId
        dataForm.categoryName = data.categoryName
        dataForm.seq = data.seq
        dataForm.pic = data.pic
        dataForm.parentId = data.parentId
        dataForm.status = data.status
        selectedCategory = idList(categoryList, data.parentId, 'categoryId', 'children').reverse()
      })
    }
  })
}
const handleChange  = (val) => {
  dataForm.parentId = val[val.length - 1]
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  if (selectedCategory.length === 1) {
    dataForm.grade = 0
  }
  if (selectedCategory.length === 2) {
    dataForm.grade = 1
  }
  if (selectedCategory.length === 3) {
    dataForm.grade = 2
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit) {
        return
      }
      isSubmit = true
      http({
        url: http.adornUrl('/prod/category'),
        method: dataForm.categoryId ? 'put' : 'post',
        data: http.adornData({
          categoryId: dataForm.categoryId || undefined,
          categoryName: dataForm.categoryName,
          status: dataForm.status,
          seq: dataForm.seq,
          grade: dataForm.grade,
          parentId: dataForm.parentId,
          pic: dataForm.pic
        })
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            isSubmit = false
            visible = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
})

</script>
