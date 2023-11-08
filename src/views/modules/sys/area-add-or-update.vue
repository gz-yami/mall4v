<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.areaId ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="地区名称"
        prop="areaName"
      >
        <el-input
          v-model="dataForm.areaName"
          placeholder="请输入地区名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="上级地区"
        prop="parentId"
      >
        <el-cascader
          v-model="selectedOptions"
          expand-trigger="hover"
          :options="areaList"
          :props="categoryTreeProps"
          change-on-select
          filterable
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="visible = false"
        >取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate } from '@/utils'
import { Debounce } from '@/utils/debounce'

  emits: ['refreshDataList'],


var visible = ref(false)
var roleList = ref([])
var dataForm = reactive({
  areaId: '',
  areaName: null,
  parentId: null,
  level: null
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 20 // 每页显示多少条
})
var dataRule = reactive({
  areaName: [
    { required: true, message: '区域名称不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的区域名称', trigger: 'blur' }
  ]
})
var areaList = ref([])
var categoryTreeProps = reactive({
  value: 'areaId',
  label: 'areaName'
})
var selectedOptions = ref([])


const init  = (areaId) => {
  dataForm.areaId = areaId || 0
  visible = true
  selectedOptions = []
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.areaId) {
      http({
        url: http.adornUrl('/admin/area/info/' + dataForm.areaId),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm = data
        selectedOptions.push(dataForm.parentId)
        categoryTreeProps.areaId = dataForm.areaId
        categoryTreeProps.areaName = dataForm.areaName
      })
    }

    http({
      url: http.adornUrl('/admin/area/list'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      areaList = treeDataTranslate(data, 'areaId', 'parentId')
    })
  })
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/admin/area'),
        method: dataForm.areaId ? 'put' : 'post',
        data: http.adornData(dataForm)
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
}),
const handleChange  = (val) => {
  dataForm.parentId = val[val.length - 1]
}

</script>
