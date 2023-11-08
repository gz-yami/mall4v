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
      <!--      <template slot="menuLeft">-->
      <!--        <el-button type="danger"-->
      <!--                   @click="deleteHandle()"-->
      <!--                   v-if="isAuth('admin:user:delete')"-->
      <!--                   size="small"-->
      <!--                   :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      <!--      </template>-->

      <template
        #default="scope"
        #pic
      >
        <span
          v-if="scope.row.pic"
          class="avue-crud__img"
        >
          <i
            :src="scope.row.pic"
            class="el-icon-document"
          />
        </span>
        <span v-else>-</span>
      </template>

      <template
        #default="scope"
        #status
      >
        <el-tag
          v-if="scope.row.status === 0"
          size="small"
          type="danger"
        >
          禁用
        </el-tag>
        <el-tag
          v-else
          size="small"
        >
          正常
        </el-tag>
      </template>

      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('admin:user:update')"
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click.stop="addOrUpdateHandle(scope.row.userId)"
        >
          编辑
        </el-button>

        <!--        <el-button type="danger"-->
        <!--                   icon="el-icon-delete"-->
        <!--                   size="small"-->
        <!--                   v-if="isAuth('admin:user:delete')"-->
        <!--                   @click.stop="deleteHandle(scope.row.userId)">删除</el-button>-->
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
import { tableOption } from '@/crud/user/user'
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
        url: this.$http.adornUrl('/admin/user/page'),
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
        return item.userId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/user'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
        .catch(() => { })
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
