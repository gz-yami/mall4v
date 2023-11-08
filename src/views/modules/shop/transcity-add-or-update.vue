<template>
  <div class="shop-transcity-add-or-update">
    <el-dialog
      v-model:visible="visible"
      :modal="false"
      title="选择配送区域"
      :close-on-click-modal="false"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        label-width="80px"
        style="height:400px"
        @keyup.enter="onSubmit()"
      >
        <el-scrollbar style="height:100%">
          <el-form-item
            size="mini"
            label="配送区域"
          >
            <el-tree
              v-if="visible"
              ref="menuListTreeRef"
              :data="menuList"
              :props="menuListTreeProps"
              node-key="areaId"
              show-checkbox
            />
          </el-form-item>
        </el-scrollbar>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { treeDataTranslate } from '@/utils'

  emits: ['refreshDataList'],


var type = ref(0)
var visible = ref(false)
var menuList = ref([])
var rowIndex = ref(0)
var menuListTreeProps = reactive({
  label: 'areaName',
  children: 'children'
})
var dataForm = {
  transfeeId: 0
}


const init  = (rowIndex, cityList, allSelectCityList, type) => {
  type = type
  rowIndex = rowIndex
  if (menuList.length === 0) {
    // 获取所有省和市
    http({
      url: http.adornUrl('/admin/area/list'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      menuList = treeDataTranslate(data, 'areaId', 'parentId')
    }).then(() => {
      visible = true
      disabledNodes(cityList, allSelectCityList)
      nextTick(() => {
        dataFormRef.value?.resetFields()
        menuListTreeRef.value?.setCheckedNodes(cityList)
      })
    })
  } else {
    visible = true
    disabledNodes(cityList, allSelectCityList)
    nextTick(() => {
      dataFormRef.value?.resetFields()
      menuListTreeRef.value?.setCheckedNodes(cityList)
    })
  }
}
const disabledNodes  = (cityList, allSelectCityList) => {
  for (let i = 0; i < menuList.length; i++) {
    const childrens = menuList[i].children
    menuList[i].disabled = false
    let disabledNum = 0
    for (let j = 0; j < childrens.length; j++) {
      const city = childrens[j]
      menuList[i].children[j].disabled = false
      const allHasCity = allSelectCityList.findIndex((item) => city.areaId === item.areaId) > -1
      const listHasCity = cityList.findIndex((item) => city.areaId === item.areaId) > -1
      if (allHasCity && !listHasCity) {
        menuList[i].children[j].disabled = true
        disabledNum++
      }
    }
    if (disabledNum === menuList[i].children.length) {
      menuList[i].disabled = true
    }
  }
}
// 表单提交
const onSubmit  = () => {
  emit('refreshDataList', rowIndex, menuListTree.getCheckedNodes(true), thisRef.value?.type)
  visible = false
}

</script>

<style lang="scss">
.shop-transcity-add-or-update {
  .el-scrollbar__wrap{overflow-x:hidden;}
}
</style>
