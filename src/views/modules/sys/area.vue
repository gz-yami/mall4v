<template>
  <div class="mod-sys-area">
    <el-input
      v-model="areaName"
      class="area-search-input"
      placeholder="地区关键词"
    />
    <el-button
      type="primary"
      size="mini"
      class="area-add-btn"
      @click="onAddOrUpdate()"
    >
      新增
    </el-button>

    <el-tree
      ref="tree2Ref"
      :data="data"
      node-key="areaId"
      :filter-node-method="filterNode"
      :props="props"
      :expand-on-click-node="false"
    >
      <span
        slot-scope="{ node, data }"
        class="custom-tree-node"
      >
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            icon="el-icon-edit"
            
            @click="() => update(node, data)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            
            @click="() => remove(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import { tableOption } from '@/crud/sys/area'
import AddOrUpdate from './area-add-or-update'
import { treeDataTranslate } from '@/utils'


var dataList = ref([])
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var dataListLoading = ref(false)
tableOption
var addOrUpdateVisible = ref(false)
var areaName = ref('')
var dataForm = reactive({})
var data = ref([])
var params = reactive({
  areaName: null
})
var props = {
  id: 'areaId',
  label: 'areaName',
  children: 'children'
}
  watch: {
    areaName (val) {
      tree2Ref.value?.filter(val)
    }
  },


const getDataList  = (pageParam, params, done) => {
  http({
    url: http.adornUrl('/admin/area/list'),
    method: 'get',
    params: http.adornParams(Object.assign({
      current: pageParam == null ? page.currentPage : pageParam.currentPage,
      size: pageParam == null ? page.pageSize : pageParam.pageSize
    }, params))
  }).then(({ data }) => {
    const treeData = treeDataTranslate(data, 'areaId', 'parentId')
    data = treeData
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
const onDelete  = (areaId) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/admin/area/' + areaId),
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
const update  = (node, data) => {
  onAddOrUpdate(data.areaId)
}

const remove  = (node, data) => {
  onDelete(data.areaId)
}

const filterNode  = (value, data) => {
  if (!value) return true
  return data.areaName.indexOf(value) !== -1
}


</script>

<style lang="scss" scoped>
.mod-sys-area {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .area-search-input {
    width: 30%;
  }
  .area-add-btn {
    float: right;
  }
}
</style>
