<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="dataFormSubmit()"
    >
      <el-form-item
        label="创建时间"
        prop="createTime"
      >
        <el-date-picker
          v-model="dataForm.createTime"
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="userName"
      >
        <el-input
          v-model="dataForm.userName"
          placeholder="姓名"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="dataForm.email"
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item
        label="联系方式"
        prop="contact"
      >
        <el-input
          v-model="dataForm.contact"
          placeholder="联系方式"
        />
      </el-form-item>
      <el-form-item
        label="留言内容"
        prop="content"
      >
        <tiny-mce
          ref="content"
          v-model="dataForm.content"
        />
      </el-form-item>
      <el-form-item
        label="留言回复"
        prop="reply"
      >
        <tiny-mce
          ref="reply"
          v-model="dataForm.reply"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        size="mini"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            未审核
          </el-radio>
          <el-radio :label="1">
            审核通过
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span
        class="dialog-footer"
      >
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dataFormSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { isEmail } from '@/utils/validate'
import TinyMce from '@/components/tiny-mce'
export default {

  components: {
    TinyMce
  },
  emits: ['refreshDataList'],

  data () {
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        id: 0,
        createTime: '',
        userName: '',
        email: '',
        contact: '',
        content: '',
        reply: '',
        status: 0
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataRule: {
        userMail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.$refs.content.setContent('')
        this.$refs.reply.setContent('')
      })
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/admin/message/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.$refs.content.setContent(data.content)
          this.$refs.reply.setContent(data.reply)
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/admin/message'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              createTime: this.dataForm.createTime,
              userName: this.dataForm.userName,
              email: this.dataForm.email,
              contact: this.dataForm.contact,
              content: this.dataForm.content,
              reply: this.dataForm.reply,
              status: this.dataForm.status
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          })
        }
      })
    }
  }
}
</script>
