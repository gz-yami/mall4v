<template>
  <div class="mod-shop-notice">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="onSearch"
      @on-load="getDataList"
      @refresh-change="refreshChange"
    >
      <template
        #default="scope"
        #status
      >
        <el-tag
          v-if="scope.row.status === 0"
          
          type="danger"
        >
          撤销
        </el-tag>
        <el-tag
          v-else
          
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
          
        >
          否
        </el-tag>
        <el-tag
          v-else
          
        >
          是
        </el-tag>
      </template>
      <template #menuLeft>
        <el-button
          v-if="isAuth('shop:notice:save')"
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
          v-if="isAuth('shop:notice:update')"
          type="primary"
          
          icon="el-icon-edit"
          @click="onAddOrUpdate(scope.row.id)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('shop:notice:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click.stop="onDelete(scope.row.id)"
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
import { tableOption } from '@/crud/shop/notice'
import AddOrUpdate from './notice-add-or-update'


var dataList = ref([])
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var dataListLoading = ref(false)
tableOption
var permission = reactive({
  delBtn: isAuth('shop:notice:delete')
})
var addOrUpdateVisible = ref(false)


const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/shop/notice/page'),
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
const onDelete  = (id) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/shop/notice/' + id),
      method: 'delete',
      data: http.adornData({})
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
