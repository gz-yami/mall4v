<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.transportId ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="1400px"
    class="transport-dialog"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="模板名称"
        prop="transName"
        :rules="[
          { required: true, message: '模板名称不能为空'},
          { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的模板名称', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="dataForm.transName"
          placeholder="模板名称"
        />
      </el-form-item>
      <el-form-item
        label="模板类型"
        prop="isFreeFee"
        required="required"
      >
        <template>
          <el-radio-group
            v-model="dataForm.isFreeFee"
            @change="changeFreeFee"
          >
            <el-radio :label="0">
              买家承担运费
            </el-radio>
            <el-radio :label="1">
              卖家包邮
            </el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item
        label="收费方式"
        prop="chargeType"
      >
        <template>
          <el-radio-group
            v-model="dataForm.chargeType"
            :disabled="dataForm.isFreeFee == 1"
          >
            <el-radio :label="0">
              按件数
            </el-radio>
            <el-radio :label="1">
              按重量
            </el-radio>
            <el-radio :label="2">
              按体积
            </el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-table
        :data="dataForm.transfees"
        border
        style="width: 100%;"
        class="table-con"
      >
        <el-table-column
          header-align="center"
          align="center"
          width="450"
          label="可配送区域"
        >
          <template #default="scope">
            <span v-if="scope.$index == 0">所有地区</span>
            <span v-if="(!scope.row.cityList || !scope.row.cityList.length) && scope.$index > 0">请选择可配送区域</span>
            <span v-if="scope.$index > 0">
              <el-tag
                v-for="city in scope.row.cityList"
                :key="city.areaId"
              >{{ city.areaName }}</el-tag>
            </span>
            <el-button
              v-if="isAuth('shop:transfee:update') && scope.$index > 0"
              type="text"
              
              @click="onAddOrUpdate(`${scope.$index}`)"
            >
              编辑
            </el-button>
            <el-button
              v-if="isAuth('shop:transfee:delete') && scope.$index > 0"
              type="text"
              
              @click="onDelete(`${scope.$index}`)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="180"
          :label="tableTitle[0]"
        >
          <template #default="scope">
            <el-form-item
              :prop="`transfees.${scope.$index}.firstPiece`"
              label-width="0px"
              :rules="[{ required: true, message: `${tableTitle[0]}不能为空`}]"
            >
              <el-input
                v-model="scope.row.firstPiece"
                type="number"
                :disabled="!scope.row.status && scope.$index === 0"
                @change="checkNumber(scope.row, 1)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[1]"
        >
          <template #default="scope">
            <el-form-item
              :prop="`transfees.${scope.$index}.firstFee`"
              label-width="0px"
              :rules="[{ required: true, message: `${tableTitle[1]}不能为空`}]"
            >
              <el-input
                v-model="scope.row.firstFee"
                type="number"
                :min="0"
                :disabled="!scope.row.status && scope.$index === 0"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[2]"
        >
          <template #default="scope">
            <el-form-item
              :prop="`transfees.${scope.$index}.continuousPiece`"
              label-width="0px"
              :rules="[{ required: true, message: `${tableTitle[2]}不能为空`}]"
            >
              <el-input
                v-model="scope.row.continuousPiece"
                type="number"
                :disabled="!scope.row.status && scope.$index === 0"
                @change="checkNumber(scope.row, 3)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[3]"
        >
          <template #default="scope">
            <el-form-item
              :prop="`transfees.${scope.$index}.continuousFee`"
              label-width="0px"
              :rules="[{ required: true, message: `${tableTitle[3]}不能为空`}]"
            >
              <el-input
                v-model="scope.row.continuousFee"
                type="number"
                :min="0"
                :disabled="!scope.row.status && scope.$index === 0"
              />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="dataForm.isFreeFee == 0"
        style="margin-top: 20px"
      >
        <el-button
          type="primary"
          icon="el-icon-location-outline"
          @click="addTransfee()"
        >
          点击添加可配送的区域和运费
        </el-button>
      </div>
      <el-checkbox
        v-if="!dataForm.isFreeFee"
        v-model="dataForm.hasFreeCondition"
        style="margin-top:10px;font-size:50px"
      >
        指定条件包邮
      </el-checkbox>
      <el-table
        v-if="dataForm.hasFreeCondition && !dataForm.isFreeFee"
        :data="dataForm.transfeeFrees"
        border
        style="width: 100%;"
      >
        <el-table-column
          header-align="center"
          align="center"
          width="350"
          label="指定区域"
        >
          <template #default="scope">
            <span v-if="!scope.row.freeCityList || !scope.row.freeCityList.length">请选择指定包邮城市</span>
            <el-tag
              v-for="city in scope.row.freeCityList"
              :key="city.areaId"
            >
              {{ city.areaName }}
            </el-tag>
            <el-button
              v-if="isAuth('shop:transfee:update')"
              type="text"
              
              @click="addOrUpdateTransfeeFree(`${scope.$index}`)"
            >
              编辑
            </el-button>
            <el-button
              v-if="isAuth('shop:transfee:delete')"
              type="text"
              
              @click="deleteTransfeeFree(`${scope.$index}`)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="600"
          label="设置包邮条件"
        >
          <template #default="scope">
            <el-radio-group v-model="scope.row.freeType">
              <el-radio :label="0">
                满件/重量/体积包邮
              </el-radio>
              <el-radio :label="1">
                满金额包邮
              </el-radio>
              <el-radio :label="2">
                满件/重量/体积且满金额包邮
              </el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
        >
          <template #default="scope">
            <el-form-item
              v-if="scope.row.freeType == 1 || scope.row.freeType == 2"
              :prop="`transfeeFrees.${scope.$index}.amount`"
              label-width="0px"
              :rules="[{ required: true, message: `不能为空`}]"
            >
              满 <el-input
                v-model="scope.row.amount"
                style="width:100px"
              /> 元包邮
            </el-form-item>
            <el-form-item
              v-if="scope.row.freeType == 0 || scope.row.freeType == 2"
              :prop="`transfeeFrees.${scope.$index}.piece`"
              label-width="0px"
              :rules="[{ required: true, message: `不能为空`}]"
            >
              满 <el-input
                v-model="scope.row.piece"
                style="width:100px"
              /> 件/重量/体积包邮
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="dataForm.isFreeFee == 0"
        style="margin-top: 20px"
      >
        <el-button
          type="primary"
          icon="el-icon-location-outline"
          @click="addTransfeeFree()"
        >
          点击添加指定包邮条件
        </el-button>
      </div>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </el-dialog>
</template>

<script setup>
import { Debounce } from '@/utils/debounce'
import AddOrUpdate from './transcity-add-or-update'


  emits: ['refreshDataList'],


var hasFreeCondition = ref(0)
var visible = ref(false)
var addOrUpdateVisible = ref(false)
var dataForm = reactive({
  hasFreeCondition: false,
  transName: '',
  createTime: '',
  chargeType: 0,
  transportId: 0,
  isFreeFee: 0,
  transfees: [{ cityList: [], status: 1 }],
  transfeeFrees: [{ freeCityList: [], freeType: 0 }]
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var editVisible = ref(false)

  computed: {
    tableTitle () {
      const titles = [['首件(个)', '运费(元)', '续件(个)', '续费(元)'], ['首重(kg)', '运费(元)', '续重(kg)', '续费(元)'], ['首体积(m³)', '运费(元)', '续体积(m³)', '续费(元)']]
      if (dataForm.chargeType) {
        return titles[dataForm.chargeType]
      }
      return titles[0]
    }
  },

  watch: {
    // 如果当前对话框不可见，则关闭选择城市的对话框
    visible: function (val) {
      if (!val) {
        addOrUpdateVisible = false
      }
    }
  },


const init  = (id) => {
  visible = true
  dataForm.transportId = id || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    dataForm = {
      hasFreeCondition: false,
      transName: '',
      createTime: '',
      chargeType: 0,
      transportId: 0,
      isFreeFee: 0,
      transfees: [{ cityList: [], status: 1 }],
      transfeeFrees: [{ freeCityList: [], freeType: 0 }]
    }
  })
  if (dataForm.transportId) {
    http({
      // 获取运费模板数据
      url: http.adornUrl(`/shop/transport/info/${dataForm.transportId}`),
      method: 'get'
    }).then(({ data }) => {
      if (data.isFreeFee) {
        data.transfees[0].status = 0
      } else {
        data.transfees[0].status = 1
      }
      dataForm = data
      dataForm.hasFreeCondition = !!data.hasFreeCondition
    })
  }
}
const getDataList  = (row, cityList, type) => {
  if (type === 0) {
    dataForm.transfees[row].cityList = cityList
  }
  if (type === 1) {
    dataForm.transfeeFrees[row].freeCityList = cityList
  }
}
// 添加运费项
const addTransfee  = () => {
  editVisible = true
  dataForm.transfees.push({ cityList: [], status: 1 })
}
// 删除运费项
const onDelete  = (rowIndex) => {
  dataForm.transfees.splice(rowIndex, 1)
}
// 可配送区域和运费编辑
const onAddOrUpdate  = (rowIndex) => {
  addOrUpdateVisible = true
  let allSelectCityList = []
  for (let i = 1; i < dataForm.transfees.length; i++) {
    const cityList = dataForm.transfees[i].cityList
    allSelectCityList = allSelectCityList.concat(cityList)
  }
  nextTick(() => {
    addOrUpdate.value?.init(rowIndex, dataForm.transfees[rowIndex].cityList || [], allSelectCityList, 0)
  })
}
// 添加指定包邮条件
const addTransfeeFree  = () => {
  if (dataForm.hasFreeCondition) {
    dataForm.transfeeFrees.push({ freeCityList: [], freeType: 0 })
  }
}
// 删除指定包邮条件
const deleteTransfeeFree  = (rowIndex) => {
  dataForm.transfeeFrees.splice(rowIndex, 1)
}
// 指定包邮条件编辑
const addOrUpdateTransfeeFree  = (rowIndex) => {
  addOrUpdateVisible = true
  let allSelectCityList = []
  for (let i = 1; i < dataForm.transfeeFrees.length; i++) {
    const freeCityList = dataForm.transfeeFrees[i].freeCityList
    allSelectCityList = allSelectCityList.concat(freeCityList)
  }
  nextTick(() => {
    addOrUpdate.value?.init(rowIndex, dataForm.transfeeFrees[rowIndex].freeCityList || [], allSelectCityList, 1)
  })
}
// 改变模板类型， 0 买家承担运费 1 卖家包邮
const changeFreeFee  = (val) => {
  dataForm.hasFreeCondition = false
  if (val) {
    dataForm.chargeType = 0
    dataForm.transfees = [{ cityList: [], status: 0, firstPiece: 1, firstFee: 0, continuousPiece: 1, continuousFee: 0 }]
  } else {
    dataForm.transfees = [{ cityList: [], status: 1 }]
  }
}
/**
 * 校验输入的数字
 */
const checkNumber  = (row, type) => {
  if (type === 1) {
    row.firstPiece = getNumber(row.firstPiece)
    row.firstPiece = row.firstPiece === 0 ? 1 : row.firstPiece
  } else if (type === 3) {
    row.continuousPiece = getNumber(row.continuousPiece)
    row.continuousPiece = row.continuousPiece === 0 ? 1 : row.continuousPiece
  }
}
/**
 * 保留整数并小于零的数设为0
 */
const getNumber  = (num) => {
  num = Math.round(num)
  return num < 0 ? 0 : num
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      for (let i = 1; i < dataForm.transfees.length; i++) {
        const transfee = dataForm.transfees[i]
        if (transfee.cityList.length === 0) {
          ElMessage({
            message: '请选择可配送区域',
            type: 'error',
            duration: 1500
          })
          return
        }
      }
      if (dataForm.hasFreeCondition) {
        hasFreeCondition = 1
      } else {
        hasFreeCondition = 0
      }
      dataForm.transfees[0].cityList = []
      http({
        url: http.adornUrl('/shop/transport'),
        method: dataForm.transportId ? 'put' : 'post',
        data: http.adornData({
          transportId: dataForm.transportId || undefined,
          transName: dataForm.transName,
          chargeType: dataForm.chargeType,
          isFreeFee: dataForm.isFreeFee,
          transfees: dataForm.transfees,
          transfeeFrees: dataForm.transfeeFrees,
          hasFreeCondition: hasFreeCondition
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

<style scoped>
.transport-dialog .table-con .el-form-item {
  margin-top: 16px;
  margin-bottom: 16px!important;
}
</style>
