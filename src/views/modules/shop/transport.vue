<template>
  <div class="mod-transport">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :option="tableOption"
      @search-change="onSearch"
      @selection-change="selectionChange"
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
          v-if="isAuth('shop:transport:save')"
          type="primary"
          icon="el-icon-plus"
          
          @click.stop="onAddOrUpdate()"
        >
          新增
        </el-button>

        <el-button
          v-if="isAuth('shop:transport:delete')"
          type="danger"
          
          :disabled="dataListSelections.length <= 0"
          @click="onDelete()"
        >
          批量删除
        </el-button>
      </template>

      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('shop:transport:update')"
          type="primary"
          icon="el-icon-edit"
          
          @click.stop="onAddOrUpdate(scope.row.transportId)"
        >
          修改
        </el-button>

        <el-button
          v-if="isAuth('shop:transport:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click.stop="onDelete(scope.row.transportId)"
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
import { tableOption } from '@/crud/shop/transport'
import AddOrUpdate from './transport-add-or-update'


var dataForm = reactive({
  transName: ''
})
var dataList = ref([])
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
tableOption

// 获取数据列表
const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/shop/transport/page'),
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
  const ids = id ? [id] : dataListSelections.map(item => { return item.transportId })
  ElMessageBox.confirm(
    `确定进行[${id ? '删除' : '批量删除'}]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    http({
      url: http.adornUrl('/shop/transport'),
      method: 'delete',
      data: http.adornData(ids, false)
    }).then(({ data }) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          // getDataList(page)
          refreshChange()
        }
      })
    })
  }).catch((e) => {
    console.log('e: ', e)
  })
}

// 条件查询
const onSearch  = (params, done) => {
  getDataList(page, params, done)
}
// 刷新回调用
const refreshChange  = () => {
  page = crud.$refs.tablePageRef.value?.defaultPage
  getDataList(page)
  dataListSelections = []
  crudRef.value?.selectClear()
}
// 多选变化
const selectionChange  = (val) => {
  console.log('val: ', val)
  dataListSelections = val
}

</script>
