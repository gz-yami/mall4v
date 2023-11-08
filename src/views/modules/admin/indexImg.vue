<template>
  <div class="mod-prod">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="onSearch"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template #menuLeft>
        <el-button
          v-if="isAuth('admin:indexImg:save')"
          type="primary"
          icon="el-icon-plus"
          
          @click.stop="onAddOrUpdate()"
        >
          新增
        </el-button>

        <el-button
          v-if="isAuth('admin:indexImg:delete')"
          type="danger"
          
          :disabled="dataListSelections.length <= 0"
          @click="onDelete()"
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
          
          @click="onAddOrUpdate(scope.row.imgId)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('admin:indexImg:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click="onDelete(scope.row.imgId)"
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
import AddOrUpdate from './indexImg-add-or-update'
import { tableOption } from '@/crud/admin/indexImg'


var dataForm = reactive({
  indexImg: ''
})
var dataList = ref([])
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
// 修改
tableOption
var page = {
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
}

// 获取数据列表
const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/admin/indexImg/page'),
    method: 'get',
    params: http.adornParams(
      Object.assign(
        {
          current: pageParam == null ? page.currentPage : pageParam.currentPage,
          size: pageParam == null ? page.pageSize : pageParam.pageSize
        },
        params
      )
    )
  }).then(({ data }) => {
    data.records.forEach(item => {
      item.imgUrl = item.imgUrl ? resourcesUrl + item.imgUrl : ''
    })
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
// 删除
const onDelete  = (id) => {
  const ids = id ? [id] : dataListSelections.map(item => {
    return item.imgId
  })
  ElMessageBox.confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/admin/indexImg'),
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
  })
}
// 条件查询
const onSearch  = (params, done) => {
  getDataList(page, params, done)
}
// 多选变化
const selectionChange  = (val) => {
  dataListSelections = val
}

</script>
