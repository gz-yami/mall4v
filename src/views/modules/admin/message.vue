<template>
  <div class="mod-user">
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
          v-if="isAuth('admin:message:save')"
          type="primary"
          icon="el-icon-plus"
          
          @click.stop="onAddOrUpdate()"
        >
          新增
        </el-button>

        <el-button
          v-if="isAuth('admin:message:delete')"
          type="danger"
          :disabled="dataListSelections.length <= 0"
          @click="onDelete()"
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
          未审核
        </el-tag>
        <el-tag
          v-else
          
        >
          审核通过
        </el-tag>
      </template>

      <template
        #default="scope"
        #menu
      >
        <el-button
          v-if="isAuth('admin:message:release')"
          type="text"
          
          @click="setMessageRelease(scope.row.id)"
        >
          公开留言
        </el-button>
        <el-button
          v-if="isAuth('admin:message:cancel')"
          type="text"
          
          @click="setMessageCancel(scope.row.id)"
        >
          取消公开
        </el-button>
        <el-button
          v-if="isAuth('admin:message:update')"
          type="text"
          
          @click="onAddOrUpdate(scope.row.id)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('admin:message:delete')"
          type="text"
          
          @click="onDelete(scope.row.id)"
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
import AddOrUpdate from './message-add-or-update'
import { tableOption } from '@/crud/admin/message'


var dataForm = reactive({
  message: ''
})
var dataList = ref([])
var pageIndex = ref(1)
var pageSize = ref(10)
var totalPage = ref(0)
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
    url: http.adornUrl('/admin/message/page'),
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
// 公开留言
const setMessageRelease  = (id) => {
  if (id) {
    http({
      url: http.adornUrl(`/admin/message/release/${id}`),
      method: 'put',
      data: http.adornData({
        id
      })
    }).then(({ data }) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1000,
        onClose: () => {
          visible = false
          getDataList(page)
        }
      })
    })
  }
}
// 取消公开留言
const setMessageCancel  = (id) => {
  if (id) {
    http({
      url: http.adornUrl(`/admin/message/cancel/${id}`),
      method: 'put',
      data: http.adornData({
        id
      })
    }).then(({ data }) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1000,
        onClose: () => {
          visible = false
          getDataList(page)
        }
      })
    })
  }
}
// 删除
const onDelete  = (id) => {
  const ids = id ? [id] : dataListSelections.map(item => {
    return item.id
  })
  ElMessageBox.confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl(`/admin/message/${ids}`),
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
