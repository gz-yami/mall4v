<template>
  <div class="mod-pickAddr">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :option="tableOption"
      :permission="permission"
      @search-change="onSearch"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template #menuLeft>
        <el-button
          v-if="isAuth('shop:pickAddr:save')"
          type="primary"
          icon="el-icon-plus"
          
          @click.stop="onAddOrUpdate()"
        >
          新增
        </el-button>

        <el-button
          v-if="isAuth('shop:pickAddr:delete')"
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
          v-if="isAuth('shop:pickAddr:update')"
          type="primary"
          icon="el-icon-edit"
          
          @click.stop="onAddOrUpdate(scope.row.addrId)"
        >
          编辑
        </el-button>

        <el-button
          v-if="isAuth('shop:pickAddr:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click.stop="onDelete(scope.row.addrId)"
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
import AddOrUpdate from './pickAddr-add-or-update'
import { tableOption } from '@/crud/shop/pickAddr'


var dataForm = reactive({
  addrName: ''
})
var dataList = ref([])
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)
tableOption
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var permission = {
  delBtn: isAuth('prod:prod:delete')
}

// 获取数据列表
const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/shop/pickAddr/page'),
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
  const ids = id ? [id] : dataListSelections.map(item => {
    return item.addrId
  })
  ElMessageBox.confirm(
    '确定进行删除操作?', '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      http({
        url: http.adornUrl('/shop/pickAddr'),
        method: 'delete',
        data: http.adornData(ids, false)
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
    })
    .catch(() => { })
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
