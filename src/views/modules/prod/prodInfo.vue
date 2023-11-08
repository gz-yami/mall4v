<template>
  <div class="mod-prod-info">
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="100px"
    >
      <el-form-item label="产品图片">
        <mul-pic-upload v-model="dataForm.imgs" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">
            上架
          </el-radio>
          <el-radio :label="0">
            下架
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="产品分类"
        :rules="[{ required: true, message: '请选择产品分类'}]"
        prop="categoryId"
      >
        <el-col :span="8">
          <el-cascader
            v-model="category.selected"
            expand-trigger="hover"
            :options="category.list"
            :props="category.props"
            change-on-select
            @change="handleCategoryChange"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        label="产品分组"
        :rules="[{ required: true, message: '请选择产品分组'}]"
      >
        <el-col :span="8">
          <el-select
            v-model="dataForm.tagList"
            multiple
            style="width: 250px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item
        label="产品名称"
        prop="prodName"
        :rules="[
          { required: true, message: '产品名称不能为空'},
          { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的产品名称', trigger: 'blur' }
        ]"
      >
        <el-col :span="8">
          <el-input
            v-model="dataForm.prodName"
            placeholder="产品名称"
            maxlength="50"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        label="产品卖点"
        prop="brief"
        :rules="[
          { required: false, pattern: /\s\S+|S+\s|\S/, message: '请输入正确的产品卖点', trigger: 'blur' }
        ]"
      >
        <el-col :span="8">
          <el-input
            v-model="dataForm.brief"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            placeholder="产品卖点"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="配送方式">
        <el-checkbox v-model="dataForm.deliveryMode.hasShopDelivery">
          商家配送
        </el-checkbox>
        <el-checkbox v-model="dataForm.deliveryMode.hasUserPickUp">
          用户自提
        </el-checkbox>
      </el-form-item>
      <prod-transport
        v-show="dataForm.deliveryMode.hasShopDelivery"
        v-model="dataForm.deliveryTemplateId"
      />
      <sku-tag
        ref="skuTagRef"
        :sku-list="dataForm.skuList"
        @change="skuTagChangeSkuHandler"
      />
      <sku-table
        ref="skuTableRef"
        v-model="dataForm.skuList"
        v-model:prodName="dataForm.prodName"
      />

      <el-form-item
        label="产品详情"
        prop="content"
      >
        <tiny-mce
          ref="contentRef"
          v-model="dataForm.content"
          style="width:1000px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { treeDataTranslate, idList } from '@/utils'
import MulPicUpload from '@/components/mul-pic-upload'
import ProdTransport from './prod-transport'
import SkuTag from './sku-tag'
import SkuTable from './sku-table'
import TinyMce from '@/components/tiny-mce'
import { Debounce } from '@/utils/debounce'



  emits: ['refreshDataList'],


// 分类树展示与回显
var category = reactive({
  list: [],
  selected: [],
  props: {
    value: 'categoryId',
    label: 'categoryName'
  }
})
// 规格列表
var dataForm = reactive({
  prodName: '',
  brief: '',
  pic: '',
  imgs: '',
  categoryId: 0,
  prodId: 0,
  skuList: [],
  tagList: [],
  content: '',
  status: 1,
  deliveryMode: {
    hasShopDelivery: false,
    hasUserPickUp: false
  },
  deliveryTemplateId: null
})
var tags = ref([])
var resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

  computed: {
    defalutSku () {
      return $store.state.prod.defalutSku
    }
  },

onActivated(() => {
  dataForm.prodId = useRoute().query.prodId
  getDataList()
})


// 获取分类数据
const getDataList  = () => {
  getTagList()
  getCategoryList().then(() => {
    if (dataForm.prodId) {
      // 获取产品数据
      http({
        url: http.adornUrl(`/prod/prod/info/${dataForm.prodId}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm = data
        dataForm.deliveryMode = JSON.parse(data.deliveryMode)
        skuTag.init(dataRef.value?.skuList)
        skuTableRef.value?.init()
        category.selected = idList(category.list, dataForm.categoryId, 'categoryId', 'children').reverse()
        dataForm.tagList = data.tagList
      })
    } else {
      nextTick(() => {
        dataFormRef.value?.resetFields()
        skuTagRef.value?.init()
        dataForm.pic = ''
        dataForm.imgs = ''
      })
    }
  })
}
// 获取分类信息
const getCategoryList  = () => {
  return http({
    url: http.adornUrl('/prod/category/listCategory'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    category.list = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}
// 选择分类改变事件
const handleCategoryChange  = (val) => {
  dataForm.categoryId = val[val.length - 1]
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    if (!dataForm.imgs) {
      errorMsg('请选择图片上传')
      return
    }
    if (!dataForm.deliveryMode) {
      errorMsg('请选择配送方式')
      return
    }
    if (dataForm.deliveryMode.hasShopDelivery && !dataForm.deliveryTemplateId) {
      errorMsg('请选择运费模板')
      return
    }
    const param = Object.assign({}, dataForm)
    // 设置价格和库存
    paramSetPriceAndStocks(param)

    param.deliveryMode = undefined
    param.deliveryModeVo = dataForm.deliveryMode
    // 商品主图
    param.pic = dataForm.imgs.split(',')[0]
    http({
      url: http.adornUrl('/prod/prod'),
      method: param.prodId ? 'put' : 'post',
      data: http.adornData(param)
    }).then(({ data }) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible = false
          $store.commit('common/removeMainActiveTab')
          useRouter().push({ name: 'prod-prodList' })
          emit('refreshDataList')
        }
      })
    })
  })
}),
const paramSetPriceAndStocks  = (param) => {
  // 获取规格属性信息
  // param.skuList = prodSpecRef.value?.getTableSpecData()
  // 商品库存
  param.totalStocks = 0
  // 商品价格
  param.price = 0
  // 商品原价
  param.oriPrice = 0
  // 商品实际库存
  for (let i = 0; i < param.skuList.length; i++) {
    const element = param.skuList[i]
    if (element.status !== 1) {
      continue
    }
    if (param.price === 0) {
      param.price = element.price ? Number.parseFloat(element.price) : 0
    }
    // 商品价格为最低价的那件商品的价格
    param.price = Math.min(param.price, element.price)
    if (param.price === element.price) {
      param.oriPrice = element.oriPrice ? Number.parseFloat(element.oriPrice) : 0
    }
    param.totalStocks += element.stocks ? Number.parseInt(element.stocks) : 0
  }
  // 如果sku没有商品名称，则使用商品的商品名称
  if (param.skuList.length === 1) {
    param.skuList[0].prodName = dataForm.prodName
  }
}
const skuTagChangeSkuHandler  = (skuList) => {
  const prodName = dataForm.prodName
  skuList.forEach(sku => {
    if (sku.properties) {
      sku.skuName = ''
      const properties = sku.properties.split(';')
      for (const propertiesKey in properties) {
        sku.skuName += properties[propertiesKey].split(':')[1] + ' '
      }
      sku.prodName = prodName + ' ' + sku.skuName
    }
  })
  dataForm.skuList = skuList
}
const errorMsg  = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}
// 获取所有的分组信息
const getTagList  = () => {
  http({
    url: http.adornUrl('/prod/prodTag/listTagList'),
    method: 'get',
    params: http.adornParams()
  }).then(({ data }) => {
    tags = data
  })
}

</script>
