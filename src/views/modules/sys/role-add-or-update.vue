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
        label="角色名称"
        prop="roleName"
      >
        <el-input
          v-model="dataForm.roleName"
          placeholder="角色名称"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          placeholder="备注"
        />
      </el-form-item>
      <el-form-item
        size="mini"
        label="授权"
      >
        <el-tree
          ref="menuListTreeRef"
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          show-checkbox
        />
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
import { treeDataTranslate } from '@/utils'
import { Debounce } from '@/utils/debounce'

  emits: ['refreshDataList'],


var visible = ref(false)
var menuList = ref([])
var menuListTreeProps = reactive({
  label: 'name',
  children: 'children'
})
var dataForm = reactive({
  id: 0,
  roleName: '',
  remark: ''
})
var dataRule = reactive({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的角色名称', trigger: 'blur' }
  ],
  remark: [
    { required: false, pattern: /\s\S+|S+\s|\S/, message: '输入格式有误', trigger: 'blur' }
  ]
})
var tempKey = reactive(-666666 // 临时key) 用于解决tree半选中状态项不能传给后台接口问题. # 待优化


const init  = (id) => {
  dataForm.id = id || 0
  http({
    url: http.adornUrl('/sys/menu/table'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    menuList = treeDataTranslate(data, 'menuId', 'parentId')
  }).then(() => {
    visible = true
    nextTick(() => {
      dataFormRef.value?.resetFields()
      menuListTreeRef.value?.setCheckedKeys([])
    })
  }).then(() => {
    if (dataForm.id) {
      http({
        url: http.adornUrl(`/sys/role/info/${dataForm.id}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm.roleName = data.roleName
        dataForm.remark = data.remark
        const idx = data.menuIdList.indexOf(tempKey)
        if (idx !== -1) {
          data.menuIdList.splice(idx, data.menuIdList.length - idx)
        }
        console.log(data.menuIdList)
        menuListTree.setCheckedKeys(dataRef.value?.menuIdList)
      })
    }
  })
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/sys/role'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData({
          roleId: dataForm.id || undefined,
          roleName: dataForm.roleName,
          remark: dataForm.remark,
          menuIdList: [].concat(menuListTree.getCheckedKeys(), [tempKey], $refs.menuListTreeRef.value?.getHalfCheckedKeys())
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
