<template>
  <div class="mod-prod">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :option="tableOption"
      :permission="permission"
      @search-change="onSearch"
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
          
          @click.stop="onAddOrUpdate()"
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
          
          @click.stop="onAddOrUpdate(scope.row)"
        >
          编辑
        </el-button>

        <el-button
          v-if="isAuth('prod:spec:delete')"
          type="danger"
          icon="el-icon-delete"
          
          @click.stop="onDelete(scope.row.propId)"
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
import AddOrUpdate from './spec-add-or-update'
import { tableOption } from '@/crud/prod/spec'


var dataForm = reactive({
  prodProp: ''
})
var dataList = ref([])
var pageIndex = ref(1)
var pageSize = ref(10)
var totalPage = ref(0)
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)

var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var permission = reactive({
  delBtn: isAuth('prod:prod:delete')
})
tableOption

// 获取数据列表
const getDataList  = (pageParam, params, done) => {
  dataListLoading = true
  http({
    url: http.adornUrl('/prod/spec/page'),
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
const onAddOrUpdate  = (val) => {
  addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdate.value?.init(val)
  })
}
// 删除
const onDelete  = (id) => {
  const ids = id ? [id] : dataListSelections.map(item => {
    return item.propId
  })
  ElMessageBox.confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl(`/prod/spec/${ids}`),
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

const onSearch  = (params, done) => {
  getDataList(page, params, done)
}

</script>

<style scoped>
.prop-value {
  display: inline-block;
  margin: 0 3px 3px 0;
}
</style>
