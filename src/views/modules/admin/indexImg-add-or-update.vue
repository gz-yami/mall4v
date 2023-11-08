<template>
  <div class="mod-index-img">
    <el-dialog
      v-model:visible="visible"
      :title="!dataForm.imgId ? '新增' : '修改'"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
      >
        <el-form-item
          label="轮播图片"
          prop="imgUrl"
        >
          <pic-upload v-model="dataForm.imgUrl" />
        </el-form-item>
        <el-form-item
          label="顺序"
          prop="seq"
          :rules="[
            { required: false, pattern: /\s\S+|S+\s|\S/, message: '请输入正确的顺序', trigger: 'blur' }
          ]"
        >
          <el-input v-model="dataForm.seq" />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">
              禁用
            </el-radio>
            <el-radio :label="1">
              正常
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group
            v-model="dataForm.type"
            @change="deleteRelation"
          >
            <el-radio :label="-1">
              无
            </el-radio>
            <el-radio :label="0">
              商品
            </el-radio>
            <!-- <el-radio :label="1">店铺</el-radio>
            <el-radio :label="2">活动</el-radio> -->
          </el-radio-group>
          <div v-if="dataForm.relation!=null">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px;width: 120px"
            >
              <img
                :src="card.pic"
                style="height:104px;width:100%"
              >
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ card.name }}</span>
                <el-button
                  type="text"
                  class="card-prod-name-button"
                  @click="deleteRelation"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </div>
          <div v-if="dataForm.relation==null">
            <el-button
              v-if=" dataForm.type == 0"
              
              @click="addProd"
            >
              选择商品
            </el-button>
            <!-- <el-button @click="addShop"
                       v-if=" dataForm.type == 1"
                       >选择店铺</el-button>
            <el-button @click="addActivity"
                       v-if="dataForm.type == 2"
                       >选择活动</el-button> -->
          </div>
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
    </el-dialog>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      :is-single="true"
      @refresh-select-prods="selectCouponProds"
    />
  </div>
</template>

<script setup>
import PicUpload from '@/components/pic-upload'
import ProdsSelect from '@/components/prods-select'
import { Debounce } from '@/utils/debounce'


  emits: ['refreshDataList'],


var dataForm = reactive({
  status: 1,
  des: '',
  imgUrl: '',
  seq: 0,
  imgId: 0,
  type: -1,
  relation: null
})
var dataRule = reactive({
  imgUrl: [
    { required: true, message: '轮播图片不能为空', trigger: 'blur' }
  ]
})
// 关联数据
var card = reactive({
  id: 0,
  pic: '',
  name: '',
  realData: {
    prod: [],
    shop: [],
    activity: []
  }
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var prodsSelectVisible = ref(false)
var visible = ref(false)


// 获取分类数据
const init  = (id) => {
  visible = true
  dataForm.imgId = id || 0
  if (dataForm.imgId) {
    // 获取产品数据
    http({
      url: http.adornUrl(`/admin/indexImg/info/${dataForm.imgId}`),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      dataForm = data
      if (data.relation) {
        card.pic = data.pic
        card.name = data.prodName
        card.id = data.relation
      }
    })
  } else {
    nextTick(() => {
      dataFormRef.value?.resetFields()
      dataForm.imgUrl = ''
      relation = null
    })
  }
}
// 表单提交
const onSubmit: Debounce(function  = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    const param = dataForm
    http({
      url: http.adornUrl('/admin/indexImg'),
      method: param.imgId ? 'put' : 'post',
      data: http.adornData(param)
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
  })
}),
// 删除关联数据
const deleteRelation  = () => {
  dataForm.relation = null
}
// 打开选择商品
const addProd  = () => {
  prodsSelectVisible = true
  nextTick(() => {
    prodsSelect.init(card.realDataRef.value?.prod)
  })
}
// 添加指定商品
const selectCouponProds  = (prods) => {
  card.realData.prods = prods
  if (prods.length) {
    const selectProd = prods[0]
    dataForm.relation = selectProd.prodId
    card.pic = selectProd.pic
    card.name = selectProd.prodName
    card.id = selectProd.prodId
  } else {
    card = {}
    relation = null
  }
}
const addShop  = () => {
  alert('选择店铺')
}
const addActivity  = () => {
  alert('选择活动')
}

</script>
<style lang="scss">
//card样式
.card-prod-bottom {
  position: relative;
  text-align: left;
  .card-prod-name {
    margin: auto;
    padding: 0 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 118px;
    display: inline-block;
  }
  .card-prod-name-button {
    position: absolute;
    top: 24px;
    right: 10px;
  }
}
</style>
