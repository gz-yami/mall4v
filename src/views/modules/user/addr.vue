<template>
  <div class="mod-user-userAddr">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="onSearch"
      @on-load="getDataList"
      @refresh-change="refreshChange"
      @row-del="rowDel"
    >
      <template #menuLeft>
        <el-button
          v-if="isAuth('user:addr:save')"
          type="primary"
          icon="el-icon-plus"
          
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>
      </template>
      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('user:addr:update')"
          type="primary"
          icon="el-icon-edit"
          
          @click="onAddOrUpdate(scope.row.addrId)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('user:addr:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click="rowDel(scope.row,scope.$index)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import { tableOption } from '@/crud/user/addr'
import AddOrUpdate from './addr-add-or-update'


var dataList = ref([])
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var dataListLoading = ref(false)
tableOption
var permission = reactive({
  delBtn: isAuth('user:userAddr:delete')
})
var addOrUpdateVisible = ref(false)


const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/user/addr/page'),
    method: 'get',
    params: http.adornParams(Object.assign({
      current: pageParam == null ? page.currentPage : pageParam.currentPage,
      size: pageParam == null ? page.pageSize : pageParam.pageSize
    }, params))
  }).then(({ data }) => {
    dataList = data.records
    page.total = data.total
    dataListLoading = false
    if (done) {
      done()
    }
  })
}
// 新增 / 修改
const onAddOrUpdate  = (id) => {
  addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdate.value?.init(id)
  })
}
const rowDel  = (row, index) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/user/addr/' + row.addrId),
      method: 'delete',
      data: http.adornData({})
    }).then(({ data }) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataList(page)
        }
      })
    })
  }).catch(() => { })
}
/**
 * 刷新回调
 */
const refreshChange  = () => {
  getDataList(page)
}
const onSearch  = (params, done) => {
  getDataList(page, params, done)
}

</script>

<style lang="scss" scoped>
</style>
