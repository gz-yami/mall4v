<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
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
          ref="contentRef"
          v-model="dataForm.content"
        />
      </el-form-item>
      <el-form-item
        label="留言回复"
        prop="reply"
      >
        <tiny-mce
          ref="replyRef"
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
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { isEmail } from '@/utils/validate'
import TinyMce from '@/components/tiny-mce'


  emits: ['refreshDataList'],


var visible = ref(false)
var dataForm = reactive({
  id: 0,
  createTime: '',
  userName: '',
  email: '',
  contact: '',
  content: '',
  reply: '',
  status: 0
})
var page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
var dataRule = {
  userMail: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ]
}


const init  = (id) => {
  dataForm.id = id || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    contentRef.value?.setContent('')
    replyRef.value?.setContent('')
  })
  if (dataForm.id) {
    http({
      url: http.adornUrl(`/admin/message/info/${dataForm.id}`),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      dataForm = data
      content.setContent(dataRef.value?.content)
      reply.setContent(dataRef.value?.reply)
    })
  }
}
// 表单提交
const onSubmit  = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      http({
        url: http.adornUrl('/admin/message'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData({
          id: dataForm.id || undefined,
          createTime: dataForm.createTime,
          userName: dataForm.userName,
          email: dataForm.email,
          contact: dataForm.contact,
          content: dataForm.content,
          reply: dataForm.reply,
          status: dataForm.status
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
}

</script>
