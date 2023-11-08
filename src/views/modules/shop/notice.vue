<template>
  <div class="mod-shop-notice">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="searchChange"
      @on-load="getDataList"
      @refresh-change="refreshChange"
    >
      <template
        #default="scope"
        #status
      >
        <el-tag
          v-if="scope.row.status === 0"
          size="small"
          type="danger"
        >
          撤销
        </el-tag>
        <el-tag
          v-else
          size="small"
        >
          公布
        </el-tag>
      </template>
      <template
        #default="scope"
        #isTop
      >
        <el-tag
          v-if="scope.row.isTop === 0"
          size="small"
        >
          否
        </el-tag>
        <el-tag
          v-else
          size="small"
        >
          是
        </el-tag>
      </template>
      <template #menuLeft>
        <el-button
          v-if="isAuth('shop:notice:save')"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
      </template>
      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('shop:notice:update')"
          type="primary"
          size="small"
          icon="el-icon-edit"
          @click="addOrUpdateHandle(scope.row.id)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('shop:notice:delete')"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click.stop="deleteHandle(scope.row.id)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script>
import { tableOption } from '@/crud/shop/notice'
import AddOrUpdate from './notice-add-or-update'
export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      tableOption,
      permission: {
        delBtn: this.isAuth('shop:notice:delete')
      },
      addOrUpdateVisible: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    getDataList (page, params, done) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/notice/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, params))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        if (done) {
          done()
        }
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/shop/notice/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (params, done) {
      this.getDataList(this.page, params, done)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
