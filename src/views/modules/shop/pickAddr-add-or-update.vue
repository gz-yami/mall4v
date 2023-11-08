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
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="名称"
        prop="addrName"
      >
        <el-input
          v-model="dataForm.addrName"
          placeholder="自提点名称"
        />
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
        label="地址"
        prop="addr"
      >
        <el-input
          v-model="dataForm.addr"
          placeholder="地址"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
      >
        <el-input
          v-model="dataForm.mobile"
          maxlength="11"
          placeholder="手机号"
        />
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
import { isMobile } from '@/utils/validate'
import { Debounce } from '@/utils/debounce'


  emits: ['refreshDataList'],


var visible = ref(false)
var provinceList = ref([])
var cityList = ref([])
var areaList = ref([])
var dataForm = reactive({
  addrId: 0,
  addr: '',
  addrName: '',
  mobile: '',
  area: '',
  city: '',
  province: '',
  areaId: null,
  cityId: null,
  provinceId: null
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var dataRule = {
  addrName: [
    { required: true, message: '自提点名称不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的自提点名称', trigger: 'blur' }
  ],
  addr: [
    { required: true, message: '地址不能为空', trigger: 'blur' },
    { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的地址', trigger: 'blur' }
  ],
  city: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
  province: [
    { required: true, message: '省份不能为空', trigger: 'blur' }
  ],
  area: [{ required: true, message: '区/县不能为空', trigger: 'blur' }],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ]
}


const init  = (id) => {
  dataForm.addrId = id || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    cityList = []
    areaList = []
    dataForm.provinceId = null
    dataForm.cityId = null
    dataForm.areaId = null
  })
  listAreaByParentId().then(({ data }) => {
    provinceList = data
  })
  if (dataForm.addrId) {
    http({
      url: http.adornUrl(
        `/shop/pickAddr/info/${dataForm.addrId}`
      ),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      dataForm.addr = data.addr
      dataForm.mobile = data.mobile
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
  dataFormRef.value?.validate(valid => {
    if (valid) {
      http({
        url: http.adornUrl('/shop/pickAddr'),
        method: dataForm.addrId ? 'put' : 'post',
        data: http.adornData({
          addrId: dataForm.addrId || undefined,
          addr: dataForm.addr,
          addrName: dataForm.addrName,
          mobile: dataForm.mobile,
          area: dataForm.area,
          city: dataForm.city,
          province: dataForm.province,
          areaId: dataForm.areaId,
          cityId: dataForm.cityId,
          provinceId: dataForm.provinceId
        })
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            emit('refreshDataList', page)
          }
        })
      })
    }
  })
})

</script>
