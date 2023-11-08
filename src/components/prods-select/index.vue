<template>
  <el-dialog
    v-model:visible="visible"
    title="选择商品"
    :modal="false"
    :close-on-click-modal="false"
  >
    <el-table
      ref="prodTableRef"
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectChangeHandle"
    >
      <el-table-column
        v-if="isSingle"
        width="50"
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <div>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-radio
              v-model="singleSelectProdId"
              :label="scope.row.prodId"
              @change="getSelectProdRow(scope.row)"
            >
&nbsp;
            </el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isSingle"
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="prodName"
        header-align="center"
        align="center"
        label="产品名称"
      />
      <el-table-column
        align="center"
        width="140"
        label="产品图片"
      >
        <template #default="scope">
          <img
            :src="scope.row.pic"
            width="100"
            height="100"
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitProds()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>

const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean
  }
})
  emits: ['refreshSelectProds'],


var visible = ref(false)
var dataForm = reactive({
  product: ''
})
var singleSelectProdId = ref(0)
var allData = ref([])
var selectProds = ref([])
var dataList = ref([])
var pageIndex = ref(1)
var pageSize = ref(10)
var totalPage = ref(0)
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)

onActivated(() => {
  getDataList()
})


// 获取数据列表
const init  = (selectProds) => {
  selectProds = selectProds
  visible = true
  dataListLoading = true
  if (selectProds) {
    selectProds.forEach(row => {
      dataListSelections.push(row)
    })
  }
  getDataList()
}
const getDataList  = () => {
  http({
    url: http.adornUrl('/prod/prod/page'),
    method: 'get',
    params: http.adornParams(
      Object.assign(
        {
          current: pageIndex,
          size: pageSize
        },
        {
          prodName: dataForm.prodName
        }
      )
    )
  }).then(({ data }) => {
    dataList = data.records
    totalPage = data.total
    dataListLoading = false
    if (selectProds) {
      nextTick(() => {
        selectProds.forEach(row => {
          const index = dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
          prodTable.toggleRowSelection(thisRef.value?.dataList[index])
        })
      })
    }
  })
}
// 每页数
const sizeChangeHandle  = (val) => {
  pageSize = val
  pageIndex = 1
  getDataList()
}
// 当前页
const currentChangeHandle  = (val) => {
  pageIndex = val
  getDataList()
}
// 单选商品事件
const getSelectProdRow  = (row) => {
  dataListSelections = [row]
}
// 多选点击事件
const selectChangeHandle  = (selection) => {
  dataList.forEach((tableItem) => {
    const selectedProdIndex = selection.findIndex((selectedProd) => {
      if (!selectedProd) {
        return false
      }
      return selectedProd.prodId === tableItem.prodId
    })
    const dataSelectedProdIndex = dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
    if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
      dataListSelections.push(tableItem)
    } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
      dataListSelections.splice(dataSelectedProdIndex, 1)
    }
  })
}
// 确定事件
const submitProds  = () => {
  if (!dataListSelections.length) {
    ElMessage({
      message: '请选择商品',
      type: 'error',
      duration: 1000,
      onClose: () => {}
    })
    return
  }
  const prods = []
  dataListSelections.forEach(item => {
    const prodIndex = prods.findIndex((prod) => prod.prodId === item.prodId)
    if (prodIndex === -1) {
      prods.push({ prodId: item.prodId, prodName: item.prodName, pic: item.pic })
    }
  })
  emit('refreshSelectProds', prods)
  dataListSelections = []
  visible = false
}

</script>
