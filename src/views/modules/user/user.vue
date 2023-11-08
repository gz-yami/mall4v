<template>
  <div class="mod-user">
    <avue-crud
      ref="crudRef"
      :page="page"
      :data="dataList"
      :option="tableOption"
      @search-change="onSearch"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <!--      <template slot="menuLeft">-->
      <!--        <el-button type="danger"-->
      <!--                   @click="onDelete()"-->
      <!--                   v-if="isAuth('admin:user:delete')"-->
      <!--                   -->
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
          
          type="danger"
        >
          禁用
        </el-tag>
        <el-tag
          v-else
          
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
          
          @click.stop="onAddOrUpdate(scope.row.userId)"
        >
          编辑
        </el-button>

        <!--        <el-button type="danger"-->
        <!--                   icon="el-icon-delete"-->
        <!--                   -->
        <!--                   v-if="isAuth('admin:user:delete')"-->
        <!--                   @click.stop="onDelete(scope.row.userId)">删除</el-button>-->
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
import { tableOption } from '@/crud/user/user'
import AddOrUpdate from './user-add-or-update'


var dataList = ref([])
var dataListLoading = ref(false)
var dataListSelections = ref([])
var addOrUpdateVisible = ref(false)
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
    url: http.adornUrl('/admin/user/page'),
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
    return item.userId
  })
  ElMessageBox.confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl('/admin/user'),
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
