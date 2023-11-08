<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.addrId ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="收货人姓名"
        prop="receiver"
      >
        <el-input v-model="dataForm.receiver" />
      </el-form-item>
      <el-form-item label="省份">
        <el-col :span="8">
          <el-form-item prop="province">
            <el-select
              v-model="dataForm.provinceId"
              placeholder="请选择"
              @change="selectProvince"
            >
              <el-option
                v-for="province in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="province.areaId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="city">
            <el-select
              v-model="dataForm.cityId"
              placeholder="请选择"
              @change="selectCity"
            >
              <el-option
                v-for="city in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="city.areaId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="area">
            <el-select
              v-model="dataForm.areaId"
              placeholder="请选择"
            >
              <el-option
                v-for="area in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="area.areaId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="详细地址"
        prop="addr"
      >
        <el-input v-model="dataForm.addr" />
      </el-form-item>
      <el-form-item
        label="邮编"
        prop="postCode"
      >
        <el-input v-model="dataForm.postCode" />
      </el-form-item>
      <el-form-item
        label="手机"
        prop="mobile"
      >
        <el-input v-model="dataForm.mobile" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-radio-group
          v-model="dataForm.status"
          size="medium"
        >
          <el-radio :label="1">
            正常
          </el-radio>
          <el-radio :label="0">
            禁用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="默认地址"
        prop="commonAddr"
      >
        <el-radio-group
          v-model="dataForm.commonAddr"
          size="medium"
        >
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span
        class="dialog-footer"
      >
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
import { Debounce } from '@/utils/debounce'

  emits: ['refreshDataList'],


var visible = ref(false)
var roleList = ref([])
var provinceList = ref([])
var cityList = ref([])
var areaList = ref([])
var dataForm = reactive({
  addrId: null,
  userId: null,
  receiver: null,
  provinceId: null,
  province: null,
  city: null,
  cityId: null,
  area: null,
  areaId: null,
  postCode: null,
  addr: null,
  mobile: null,
  status: 1,
  commonAddr: 0
})
var dataRule = {
}


const init  = (addrId) => {
  dataForm.addrId = addrId || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    cityList = []
    areaList = []
    dataForm.provinceId = null
    dataForm.cityId = null
    dataForm.areaId = null
    if (dataForm.addrId) {
      http({
        url: http.adornUrl(`/user/addr/info/${dataForm.addrId}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm = data
        dataForm.addr = data.addr
        dataForm.addrName = data.addrName
        dataForm.areaId = data.areaId
        dataForm.cityId = data.cityId
        dataForm.provinceId = data.provinceId
        listAreaByParentId(data.provinceId).then(({ data }) => {
          cityList = data
        })
        listAreaByParentId(data.cityId).then(({ data }) => {
          areaList = data
        })
      })
    }
  })
  listAreaByParentId().then(({ data }) => {
    provinceList = data
  })
}
const listAreaByParentId  = (pid) => {
  if (!pid) pid = 0
  return http({
    url: http.adornUrl('/admin/area/listByPid'),
    method: 'get',
    params: http.adornParams({ pid })
  })
}
// 选择省
const selectProvince  = (val) => {
  dataForm.cityId = null
  dataForm.city = ''
  // 获取城市的select
  listAreaByParentId(val).then(({ data }) => {
    cityList = data
  })
}
// 选择市
const selectCity  = (val) => {
  dataForm.areaId = null
  dataForm.area = ''
  // 获取区的select
  listAreaByParentId(val).then(({ data }) => {
    areaList = data
  })
}

// 表单提交
const onSubmit: Debounce(function  = () => {
  for (let i = 0; i < provinceList.length; i++) {
    if (provinceList[i].areaId === dataForm.provinceId) {
      // 将省名字保存起来
      dataForm.province = provinceList[i].areaName
    }
  }
  for (let i = 0; i < cityList.length; i++) {
    if (cityList[i].areaId === dataForm.cityId) {
      // 将市名字保存起来
      dataForm.city = cityList[i].areaName
    }
  }
  for (let i = 0; i < areaList.length; i++) {
    if (areaList[i].areaId === dataForm.areaId) {
      // 将市名字保存起来
      dataForm.area = areaList[i].areaName
    }
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/user/addr'),
        method: dataForm.addrId ? 'put' : 'post',
        data: http.adornData(dataForm)
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            dataFormRef.value?.resetFields()
            emit('refreshDataList')
          }
        })
      })
    }
  })
})

</script>
