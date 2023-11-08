<template>
  <div class="upload-container">
    <el-tooltip
      v-if="tinymceUploadType === 'prod'"
      :content="$t('product.uploadDetailPicTips')"
      placement="top"
    >
      <el-button
        :style="{background:color,borderColor:color}"
        icon="el-icon-upload"
        size="mini"
        type="primary"
        @click="clickUpload()"
      >
        {{ $t('components.uploadImage') }}
      </el-button>
    </el-tooltip>
    <el-button
      v-else
      :style="{background:color,borderColor:color}"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="clickUpload()"
    >
      {{ $t('components.uploadImage') }}
    </el-button>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      v-if="elxImgboxVisible"
      ref="elxImgboxRef"
      @refresh-pic="refreshPic"
    />
  </div>
</template>

<script setup>
import ImgsUpload from '@/components/imgs-upload'
import ElxImgbox from '@/components/elx-imgbox'



const props = defineProps({
  color: {
    type: String,
    default: '#1890ff'
  },
  tinymceUploadType: {
    default: '',
    type: String
  }
})
  emits: ['successCBK'],


var elxImgboxVisible = ref(false)
var maxNum = ref(15) // 可选择的最大图片数量
var imgUrls = ref([])
var resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL


/**
 * 打开图片选择窗
 */
const clickUpload  = () => {
  imgUrls = ''
  elxImgboxVisible = true
  nextTick(() => {
    elxImgbox.init(0, thisRef.value?.maxNum)
  })
}
/**
 * 接收回调的图片数据
 */
const refreshPic  = (imagePath) => {
  const imageArray = imagePath.split(',')
  const data = []
  imageArray.forEach(img => {
    data.push(resourcesUrl + img)
  })
  imgUrls = ''
  dialogVisible = false
  emit('successCBK', data)
}
// handleSubmit() {
//   let imageArray = imgUrls.split(',')
//   var data = []
//   imageArray.forEach(img => {
//     data.push(resourcesUrl + img)
//   })
//   imgUrls = ''
//   dialogVisible = false
//   emit('successCBK', data)
// }

</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep(.el-upload--picture-card) {
    width: 100%;
  }
}
</style>
