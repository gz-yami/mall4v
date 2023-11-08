<template>
  <div class="mod-prod">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataList"
      :option="tableOption"
      :permission="permission"
      @search-change="searchChange"
      @on-load="getDataList"
    >
      <template
        #default="scope"
        #prodPropValues
      >
        <el-tag
          v-for="item in scope.row.prodPropValues"
          :key="item.valueId"
        >
          {{ item.propValue }}
        </el-tag>
      </template>
      <template #menuLeft>
        <el-button
          v-if="isAuth('shop:pickAddr:save')"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click.stop="addOrUpdateHandle()"
        >
          新增
        </el-button>
      </template>

      <template
        #default="scope"
        #prodPropValues
      >
        <div
          v-for="item in scope.row.prodPropValues"
          :key="item.valueId"
          class="prop-value"
        >
          <el-tag>{{ item.propValue }}</el-tag>
        </div>
      </template>

      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('prod:spec:update')"
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click.stop="addOrUpdateHandle(scope.row)"
        >
          编辑
        </el-button>

        <el-button
          v-if="isAuth('prod:spec:delete')"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click.stop="deleteHandle(scope.row.propId)"
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
import AddOrUpdate from './spec-add-or-update'
import { tableOption } from '@/crud/prod/spec'
export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      dataForm: {
        prodProp: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,

      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      permission: {
        delBtn: this.isAuth('prod:prod:delete')
      },
      tableOption
    }
  },
  methods: {
    // 获取数据列表
    getDataList (page, params, done) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/prod/spec/page'),
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
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },
    // 删除
    deleteHandle (id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.propId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/prod/spec/${ids}`),
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

    searchChange (params, done) {
      this.getDataList(this.page, params, done)
    }
  }
}
</script>

<style scoped>
.prop-value {
  display: inline-block;
  margin: 0 3px 3px 0;
}
</style>
