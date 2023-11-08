<template>
  <el-dialog
    v-model:visible="visible"
    title="选择商品"
    :modal="false"
    :close-on-click-modal="false"
  >
    <el-table
      ref="prodTable"
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

<script>
export default {

  props: {
    isSingle: {
      default: false,
      type: Boolean
    }
  },
  emits: ['refreshSelectProds'],

  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      singleSelectProdId: 0,
      allData: [],
      selectProds: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },

  activated () {
    this.getDataList()
  },

  methods: {
    // 获取数据列表
    init (selectProds) {
      this.selectProds = selectProds
      this.visible = true
      this.dataListLoading = true
      if (this.selectProds) {
        this.selectProds.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/prod/prod/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize
            },
            {
              prodName: this.dataForm.prodName
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectProds) {
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              const index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 单选商品事件
    getSelectProdRow (row) {
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        const selectedProdIndex = selection.findIndex((selectedProd) => {
          if (!selectedProd) {
            return false
          }
          return selectedProd.prodId === tableItem.prodId
        })
        const dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
    },
    // 确定事件
    submitProds () {
      if (!this.dataListSelections.length) {
        this.$message({
          message: '请选择商品',
          type: 'error',
          duration: 1000,
          onClose: () => {}
        })
        return
      }
      const prods = []
      this.dataListSelections.forEach(item => {
        const prodIndex = prods.findIndex((prod) => prod.prodId === item.prodId)
        if (prodIndex === -1) {
          prods.push({ prodId: item.prodId, prodName: item.prodName, pic: item.pic })
        }
      })
      this.$emit('refreshSelectProds', prods)
      this.dataListSelections = []
      this.visible = false
    }
  }
}
</script>
