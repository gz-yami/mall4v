<template>
  <div class="mod-prod-sku-table">
    <el-form-item>
      <el-table
        :data="value"
        border
        style="width: 100%; margin-top: 20px"
        :span-method="tableSpanMethod"
      >
        <el-table-column
          v-for="(leftTitle, index) in tableLeftTitles"
          :key="index"
          :label="leftTitle"
        >
          <template #default="scope">
            {{ scope.row.properties.split(';')[index].split(':')[1] }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableLeftTitles.length"
          prop="pic"
          label="sku图片"
          width="180"
        >
          <template #default="scope">
            <pic-upload v-model="scope.row.pic" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableLeftTitles.length"
          prop="prodName"
          label="商品名称"
          width="250"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.prodName"
              type="textarea"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="销售价"
          width="160"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.price"
              size="small"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="oriPrice"
          label="市场价"
          width="160"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.oriPrice"
              size="small"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="stocks"
          label="库存"
          width="160"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.stocks"
              size="small"
              :min="0"
              controls-position="right"
              type="number"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="商品重量(kg)"
          width="210"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.weight"
              :precision="2"
              :min="0"
              controls-position="right"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="volume"
          label="商品体积(m³)"
          width="210"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.volume"
              :precision="2"
              :min="0"
              controls-position="right"
              :disabled="!scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status"
              type="text"
              size="small"
              @click="changeSkuStatus(`${scope.$index}`)"
            >
              禁用
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              @click="changeSkuStatus(`${scope.$index}`)"
            >
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import PicUpload from '@/components/pic-upload'
export default {

  components: {
    PicUpload
  },

  props: {
    value: {
      default: [],
      type: Array
    },
    prodName: {
      default: ''
    }
  },
  emits: ['input'],

  data () {
    return {
      // 数据库中的规格
      dbSpecs: [],
      // 根据选定的规格所查询出来的规格值
      dbSpecValues: [],
      specs: [], // 使用的规格
      initing: false
    }
  },

  computed: {
    tableLeftTitles () {
      const res = []
      for (let i = 0; i < this.skuTags.length; i++) {
        const skuTag = this.skuTags[i]
        res.push(skuTag.tagName)
      }
      return res
    },
    skuTags: {
      get () { return this.$store.state.prod.skuTags }
    },
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },

  watch: {
    prodName: function () {
      this.skuAddProdName()
    }
  },

  // activated: function () {
  //   this.$emit('input', [Object.assign({}, this.defalutSku)])
  // },
  created: function () {
    this.$http({
      url: this.$http.adornUrl('/prod/spec/list'),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      this.dbSpecs = data
    })
  },

  methods: {
    init () {
      this.initing = true
    },
    getTableSpecData () {
      return this.value
    },
    tableSpanMethod ({ row, column, rowIndex, columnIndex }) {

    },
    changeSkuStatus (tagIndex) {
      this.value[tagIndex].status = this.value[tagIndex].status ? 0 : 1
    },
    skuAddProdName () {
      if (this.initing) {
        return
      }
      const skuList = []
      for (let i = 0; i < this.value.length; i++) {
        const sku = Object.assign({}, this.value[i])
        if (!sku.properties) {
          return
        }
        sku.skuName = ''
        const properties = sku.properties.split(';')
        for (const propertiesKey in properties) {
          sku.skuName += properties[propertiesKey].split(':')[1] + ' '
        }
        sku.prodName = this.prodName + ' ' + sku.skuName
        skuList.push(sku)
      }
      this.$emit('input', skuList)
    }
  }
}
</script>

<style lang="scss">

  .mod-prod-sku-table{
    .pic-uploader-component .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .pic-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }
      .pic {
        width: 120px;
        height: 120px;
        display: block;
      }
    }
    .pic-uploader-component .el-upload:hover {
      border-color: #409EFF;
    }
  }
</style>
