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
        size="small"
        type="primary"
      >
        点击上传
      </el-button>
    </el-upload>
  </div>
</template>

<script>
export default {

  props: {
    value: {
      default: '',
      type: String
    }
  },
  emits: ['input', 'change', 'change'],

  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },

  computed: {
    fileList () {
      const res = []
      if (this.value) {
        const fileArray = this.value.split(',')
        for (let i = 0; i < fileArray.length; i++) {
          res.push({ name: fileArray[i], url: this.resourcesUrl + fileArray[i], response: fileArray[i] })
        }
      }
      this.$emit('input', this.value)
      return res
    }
  },

  methods: {
    // 图片上传
    handleUploadSuccess (response, file, fileList) {
      const files = fileList.map(file => {
        return file.response
      }).join(',')
      this.$emit('change', files)
    },
    // 限制图片上传大小
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleRemove (file, fileList) {
      const files = fileList.map(file => {
        return file.response
      }).join(',')
      this.$emit('change', files)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss">
</style>
