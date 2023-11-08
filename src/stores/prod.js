import { defineStore } from 'pinia'
export const scoreProdStore = defineStore('prod', {
  state: () => {
    return {
      id: 0,
      skuTags: [],
      defalutSku: {
        price: 0.01, // 销售价
        oriPrice: 0.01, // 市场价
        stocks: 0, // 库存
        skuScore: 1, // 积分价格
        properties: '', // 销售属性组合字符串
        skuName: '', // sku名称
        prodName: '', // 商品名称
        partyCode: '', // 商品编码
        weight: 0, // 商品重量
        volume: 0, // 商品体积
        status: 1, // 0 禁用 1 启用
        stockWarning: 0, // 库存预警
        prodNameCn: '',
        prodNameEn: '',
        skuSingleProds: []
      }
    }
  },
  actions: {
    updateSkuTags (skuTags) {
      this.skuTags = skuTags
    },
    updateSkuTag ({ skuTag, index }) {
      index = parseInt(index)
      if (skuTag && typeof index === 'number') {
        this.skuTags.splice(index, 1, skuTag)
      }
    },
    addSkuTag (skuTag) {
      this.skuTags.push(skuTag)
    },
    removeSkuTag (tagIndex) {
      this.skuTags.splice(tagIndex, 1)
    },
    removeSkuTagItem ({ tagIndex, tagItemIndex }) {
      this.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1)
    },
    addSkuTagItem ({ tagIndex, tagItem }) {
      this.skuTags[tagIndex].tagItems.push(tagItem)
    },
    updateSkuTagItem ({ skuTagItem, tagIndex, tagItemIndex }) {
      if (skuTagItem) {
        this.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1, skuTagItem)
      }
    }
  }
})
