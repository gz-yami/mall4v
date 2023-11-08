<template>
  <div class="mod-user">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataList"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template #menuLeft>
        <el-button
          v-if="isAuth('sys:user:save')"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click.stop="addOrUpdateHandle()"
        >
          新增
        </el-button>

        <el-button
          v-if="isAuth('sys:user:delete')"
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
        #menu
      >
        <el-button
          v-if="isAuth('sys:user:update')"
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click.stop="addOrUpdateHandle(scope.row.userId)"
        >
          编辑
        </el-button>

        <el-button
          v-if="isAuth('sys:user:delete')"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click.stop="deleteHandle(scope.row.userId)"
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
import { tableOption } from '@/crud/sys/user'
import AddOrUpdate from './user-add-or-update'
export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
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
        url: this.$http.adornUrl('/sys/user/page'),
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
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        if (done) {
          done()
        }
      })
    },
    // 条件查询
    searchChange (params, done) {
      this.getDataList(this.page, params, done)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
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
      const userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/user'),
          method: 'delete',
          data: this.$http.adornData(userIds, false)
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
    }
  }
}
</script>
