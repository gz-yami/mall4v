<template>
  <div class="mod-prod">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template #menuLeft>
        <el-button
          v-if="isAuth('admin:indexImg:save')"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click.stop="addOrUpdateHandle()"
        >
          新增
        </el-button>

        <el-button
          v-if="isAuth('admin:indexImg:delete')"
          type="danger"
          size="small"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()"
        >
          批量删除
        </el-button>
      </template>

      <template
        #default="scope"
        #imgUrl
      >
        <img
          v-if="scope.row.imgUrl"
          :src="scope.row.imgUrl"
          width="100"
          height="100"
        >
        <img
          v-else
          src="~@/assets/img/def.png"
          width="100"
          height="100"
        >
      </template>
      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('admin:indexImg:update')"
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click="addOrUpdateHandle(scope.row.imgId)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('admin:indexImg:delete')"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="deleteHandle(scope.row.imgId)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script>
import AddOrUpdate from './indexImg-add-or-update'
import { tableOption } from '@/crud/admin/indexImg'
export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      dataForm: {
        indexImg: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      // 修改
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  methods: {
    // 获取数据列表
    getDataList (page, params, done) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/indexImg/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            params
          )
        )
      }).then(({ data }) => {
        data.records.forEach(item => {
          item.imgUrl = item.imgUrl ? this.resourcesUrl + item.imgUrl : ''
        })
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
    // 删除
    deleteHandle (id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.imgId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/indexImg'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
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
      })
    },
    // 条件查询
    searchChange (params, done) {
      this.getDataList(this.page, params, done)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    }
  }
}
</script>
