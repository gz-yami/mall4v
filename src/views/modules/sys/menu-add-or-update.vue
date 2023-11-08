<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="(type, index) in dataForm.typeList"
            :key="index"
            :label="index"
          >
            {{ type }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="dataForm.typeList[dataForm.type] + '名称'"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :placeholder="dataForm.typeList[dataForm.type] + '名称'"
        />
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-cascader
          v-model="selectedMenu"
          expand-trigger="hover"
          :options="menuList"
          :props="menuListTreeProps"
          change-on-select
          @change="handleSelectMenuChange"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type === 1"
        label="菜单路由"
        prop="url"
      >
        <el-input
          v-model="dataForm.url"
          placeholder="菜单路由"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 0"
        label="授权标识"
        prop="perms"
      >
        <el-input
          v-model="dataForm.perms"
          placeholder="多个用逗号分隔, 如: user:list,user:create"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="排序号"
        prop="orderNum"
      >
        <el-input-number
          v-model="dataForm.orderNum"
          controls-position="right"
          :min="0"
          label="排序号"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="菜单图标"
        prop="icon"
      >
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopoverRef"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover"
            >
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  :class="{ 'is-active': item === dataForm.icon }"
                  @click="iconActiveHandle(item)"
                >
                  <icon-svg :name="item" />
                </el-button>
              </div>
            </el-popover>
            <el-input
              v-model="dataForm.icon"
              v-popover:iconListPopover
              :readonly="true"
              placeholder="菜单图标名称"
              class="icon-list__input"
            />
          </el-col>
          <el-col
            :span="2"
            class="icon-list__tips"
          >
            <el-tooltip
              placement="top"
              effect="light"
            >
              <template #content>
                <div>全站推荐使用SVG Sprite, 详细请参考:icons/index.js 描述</div>
              </template>
              <i class="el-icon-warning" />
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
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
</template>

<script setup>
import { treeDataTranslate, idList } from '@/utils'
import Icon from '@/icons'
import { Debounce } from '@/utils/debounce'

  emits: ['refreshDataList'],


var visible = ref(false)
var dataForm = reactive({
  id: 0,
  type: 1,
  typeList: ['目录', '菜单', '按钮'],
  name: '',
  parentId: 0,
  url: '',
  perms: '',
  orderNum: 0,
  icon: '',
  iconList: []
})
var dataRule = reactive({
  name: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的菜单名称', trigger: 'blur' }
  ],
  url: [
    { validator: validateUrl, trigger: 'blur' }
  ]
})
var menuList = ref([])
var selectedMenu = ref([])
var menuListTreeProps = {
  value: 'menuId',
  label: 'name'
}

onMounted(() => {
  iconList = Icon.getNameList()
})


const init  = (id) => {
  dataForm.id = id || 0
  http({
    url: http.adornUrl('/sys/menu/list'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    menuList = treeDataTranslate(data, 'menuId')
  }).then(() => {
    visible = true
    nextTick(() => {
      dataFormRef.value?.resetFields()
    })
  }).then(() => {
    if (dataForm.id) {
      // 修改
      http({
        url: http.adornUrl(`/sys/menu/info/${dataForm.id}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm.id = data.menuId
        dataForm.type = data.type
        dataForm.name = data.name
        dataForm.parentId = data.parentId
        dataForm.url = data.url
        dataForm.perms = data.perms
        dataForm.orderNum = data.orderNum
        dataForm.icon = data.icon
        selectedMenu = idList(menuList, data.parentId, 'menuId', 'children').reverse()
      })
    } else {
      selectedMenu = []
    }
  })
}
const handleSelectMenuChange  = (val) => {
  dataForm.parentId = val[val.length - 1]
}
// 图标选中
const iconActiveHandle  = (iconName) => {
  dataForm.icon = iconName
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/sys/menu'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData({
          menuId: dataForm.id || undefined,
          type: dataForm.type,
          name: dataForm.name,
          parentId: dataForm.parentId,
          url: dataForm.url,
          perms: dataForm.perms,
          orderNum: dataForm.orderNum,
          icon: dataForm.icon
        })
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
})

</script>

<style lang="scss">

  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 420px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
