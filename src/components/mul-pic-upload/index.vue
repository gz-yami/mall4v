<template>
  <div>
    <el-upload
      :action="$http.adornUrl('/admin/file/upload/element')"
      :headers="{Authorization: $cookie.get('Authorization')}"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :file-list="imageList"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog v-model:visible="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script setup>

const props = defineProps({
  value: {
    default: '',
    type: String
  }
})
  emits: ['input', 'input', 'input'],


var dialogImageUrl = ref('')
var dialogVisible = ref(false)
var resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

  computed: {
    imageList () {
      const res = []
      if (value) {
        const imageArray = value.split(',')
        for (let i = 0; i < imageArray.length; i++) {
          res.push({ url: resourcesUrl + imageArray[i], response: imageArray[i] })
        }
      }
      emit('update:modelValue', value)
      return res
    }
  },


// 图片上传
const handleUploadSuccess  = (response, file, fileList) => {
  const pics = fileList.map(file => {
    if (typeof file.response === 'string') {
      return file.response
    }
    return file.response.data
  }).join(',')
  emit('update:modelValue', pics)
}
// 限制图片上传大小
const beforeAvatarUpload  = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg'
  if (!isJPG) {
    ElMessage.error('上传图片只能是jpeg/jpg/png/gif 格式!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isLt2M && isJPG
}
const handleRemove  = (file, fileList) => {
  const pics = fileList.map(file => {
    if (typeof file.response === 'string') {
      return file.response
    }
    return file.response.data
  }).join(',')
  emit('update:modelValue', pics)
}
const handlePictureCardPreview  = (file) => {
  dialogImageUrl = file.url
  dialogVisible = true
}

</script>

<style lang="scss">
</style>
