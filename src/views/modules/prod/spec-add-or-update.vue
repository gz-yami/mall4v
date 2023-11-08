<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataList[0].propId ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <el-table
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="propName"
        header-align="center"
        align="center"
        label="属性名称"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.propName"
            placeholder="请输入内容"
            maxlength="10"
            show-word-limit
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="prodPropValues"
        header-align="center"
        align="center"
        label="属性值"
      >
        <template #default="scope">
          <el-col
            v-for="item in scope.row.prodPropValues"
            :key="item.valueId"
            :span="12"
          >
            <el-input
              v-model="item.propValue"
              placeholder="请输入内容"
              class="prop-value-input"
              maxlength="20"
              show-word-limit
              clearable
              @clear="clearProdPropValues"
            />
          </el-col>
          <el-col :span="4">
            <el-button
              v-show="scope.row.prodPropValues[scope.row.prodPropValues.length-1].propValue"
              type="primary"
              class="add-input"
              icon="el-icon-circle-plus"
              @click="addInput()"
            />
          </el-col>
        </template>
      </el-table-column>
    </el-table>
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
var dataList = reactive([{ propId: 0, propName: '', prodPropValues: [{ valueId: 0 }] }])
var dataRule = reactive({
  propName: [
    { required: true, message: '属性名称不能为空', trigger: 'blur' }
  ]
})
var page = {
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
}


const init  = (val) => {
  if (val) {
    dataList = [JSON.parse(JSON.stringify(val))]
  } else {
    dataList = [
      { propId: 0, propName: '', prodPropValues: [{ valueId: 0 }] }
    ]
  }
  visible = true
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  if (dataList[0].prodPropValues) {
    const temp = []
    for (const key in dataList[0].prodPropValues) {
      if (dataList[0].prodPropValues.hasOwnProperty(key)) {
        const element = dataList[0].prodPropValues[key]
        if (element.propValue) {
          temp.push(dataList[0].prodPropValues[key])
        }
      }
    }
    dataList[0].prodPropValues = temp
  }
  if (!dataList[0].propName.trim()) {
    dataList[0].propName = ''
    ElMessage.error('属性名不能为空')
    return
  }
  if (dataList[0].prodPropValues.length < 1) {
    dataList[0].prodPropValues = [{ valueId: 0 }]
    ElMessage.error('规格项不能为空')
    return
  }
  if (dataList[0].propName.length > 10) {
    ElMessage.error('属性名称长度不能大于10')
    return
  }
  if (dataList[0].prodPropValues.find(el => !el.propValue.trim())) {
    ElMessage.error('属性值不能为空')
    return
  }
  if (dataList[0].prodPropValues.find(el => el.propValue.length > 20)) {
    ElMessage.error('属性值长度不能大于20')
    return
  }
  http({
    url: http.adornUrl('/prod/spec'),
    method: dataList[0].propId ? 'put' : 'post',
    data: http.adornData({
      propId: dataList[0].propId || undefined,
      propName: dataList[0].propName,
      prodPropValues: dataList[0].prodPropValues
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
}),
const clearProdPropValues  = () => {
  if (dataList[0].prodPropValues.length === 1) {
    return
  }
  for (let i = 0; i < dataList[0].prodPropValues.length; i++) {
    const element = dataList[0].prodPropValues[i]
    if (!element.propValue) {
      dataList[0].prodPropValues.splice(i, 1)
    }
  }
}
const addInput  = () => {
  const temp = dataList[0].prodPropValues
  if (temp[temp.length - 1].propValue) {
    temp.push({})
  }
}

</script>

<style scoped>
.prop-value-input {
  padding: 3px;
}

.add-input {
  margin: 3px;
}
</style>
