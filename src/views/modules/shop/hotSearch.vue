<template>
  <div class="mod-hotSearcch">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="onSearch"
      @on-load="getDataList"
      @refresh-change="refreshChange"
      @selection-change="selectionChange"
    >
      <template #menuLeft>
        <el-button
          v-if="isAuth('admin:hotSearch:save')"
          type="primary"
          
          icon="el-icon-plus"
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>

        <el-button
          type="danger"
          
          :disabled="dataListSelections.length <= 0"
          @click.stop="onDelete"
        >
          批量删除
        </el-button>
      </template>

      <template
        #default="scope"
        #status
      >
        <el-tag
          v-if="scope.row.status === 0"
          
          type="danger"
        >
          未启用
        </el-tag>
        <el-tag
          v-else
          
        >
          启用
        </el-tag>
      </template>

      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('admin:hotSearch:update')"
          type="primary"
          
          icon="el-icon-edit"
          @click="onAddOrUpdate(scope.row.hotSearchId)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('admin:hotSearch:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click.stop="onDelete(scope.row,scope.index)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import { tableOption } from '@/crud/shop/hotSearch'
import AddOrUpdate from './hotSearch-add-or-update'


var dataForm = {

}
var dataList = ref([])
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)
tableOption

// 获取数据列表
const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/admin/hotSearch/page'),
    method: 'get',
    params: http.adornParams(Object.assign({
      current: pageParam ? pageParam .currentPage : 1,
      size: pageParam ? pageParam.pageSize : 20
    }, params))
  }).then(({ data }) => {
    page.total = data.total
    page.pageSize = data.size
    page.currentPage = data.current
    dataList = data.records
    dataListLoading = false
    if (done) {
      done()
    }
  })
}
// 多选回调
const selectionChange  = (list) => {
  dataListSelections = list
}
// 新增 / 修改
const onAddOrUpdate  = (id) => {
  addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdate.value?.init(id)
  })
}
// 点击查询
const onSearch  = (params, done) => {
  getDataList(page, params, done)
}
// 删除
const onDelete  = (row, index) => {
  const ids = row.hotSearchId ? [row.hotSearchId] : dataListSelections.map(item => {
    return item.hotSearchId
  })
  ElMessageBox.confirm(`确定进行[${row.hotSearchId ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/admin/hotSearch'),
      method: 'delete',
      data: http.adornData(ids, false)
    }).then(({ data }) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataList()
        }
      })
    })
  }).catch(() => { })
}
const refreshChange  = () => {
  getDataList(page)
}

</script>
