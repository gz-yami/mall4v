<template>
  <div>
    <el-upload
      :action="$http.adornUrl('/admin/file/upload/element')"
      :headers="{Authorization: $cookie.get('Authorization')}"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-remove="beforeRemove"
      :file-list="fileList"
      multiple
    >
      <el-button
        
        type="primary"
      >
        点击上传
      </el-button>
    </el-upload>
  </div>
</template>

<script setup>

const props = defineProps({
  value: {
    default: '',
    type: String
  }
})
  emits: ['input', 'change', 'change'],


var resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

  computed: {
    fileList () {
      const res = []
      if (value) {
        const fileArray = value.split(',')
        for (let i = 0; i < fileArray.length; i++) {
          res.push({ name: fileArray[i], url: resourcesUrl + fileArray[i], response: fileArray[i] })
        }
      }
      emit('update:modelValue', value)
      return res
    }
  },


// 图片上传
const handleUploadSuccess  = (response, file, fileList) => {
  const files = fileList.map(file => {
    return file.response
  }).join(',')
  emit('change', files)
}
// 限制图片上传大小
const beforeAvatarUpload  = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isLt2M
}
const handleRemove  = (file, fileList) => {
  const files = fileList.map(file => {
    return file.response
  }).join(',')
  emit('change', files)
}
const beforeRemove  = (file, fileList) => {
  return ElMessageBox.confirm(`确定移除 ${file.name}？`)
}

</script>

<style lang="scss">
</style>
