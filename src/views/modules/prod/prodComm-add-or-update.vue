<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.prodCommId ? '新增' : '修改'"
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
      <div v-if="!isEdit">
        <el-form-item
          label="评论内容"
          prop="userName"
        >
          <el-input
            v-model="dataForm.content"
            type="textarea"
            :readonly="true"
          />
        </el-form-item>

        <el-form-item
          label="评论图片"
          prop="userName"
        >
          <div v-if="dataForm.pics==null || dataForm.pics.length>0">
            无
          </div>
          <img
            v-for="item in dataForm.pics"
            v-else
            :key="item"
            max-width="100%"
            :src="dialogImageUrl + item"
          >
        </el-form-item>

        <el-form-item
          label="记录时间"
          prop="userName"
        >
          <el-input
            v-model="dataForm.recTime"
            :readonly="true"
          />
        </el-form-item>
        <el-form-item
          label="回复时间"
          prop="userName"
          :readonly="true"
        >
          <el-input
            v-model="dataForm.replyTime"
            :readonly="true"
          />
        </el-form-item>
        <el-form-item
          label="IP来源"
          prop="userName"
        >
          <el-input
            v-model="dataForm.postip"
            :readonly="true"
          />
        </el-form-item>
        <el-form-item
          label="得分"
          prop="score"
        >
          <el-input
            v-model="dataForm.score"
            :readonly="true"
          />
        </el-form-item>

        <el-form-item
          label="是否匿名"
          size="mini"
          prop="isAnonymous"
        >
          <el-radio-group
            v-model="dataForm.isAnonymous"
            :disabled="true"
          >
            <el-radio :label="1">
              是
            </el-radio>
            <el-radio :label="0">
              不是
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item
        label="掌柜回复"
        type="textarea"
        prop="userName"
      >
        <el-input
          v-model="dataForm.replyContent"
          :readonly="!isEdit"
        />
      </el-form-item>

      <el-form-item
        v-if="isEdit"
        label="审核"
        size="mini"
        prop="status"
      >
        <el-radio-group
          v-model="dataForm.status"
          :readonly="true"
        >
          <el-radio :label="1">
            审核通过
          </el-radio>
          <el-radio :label="-1">
            不通过
          </el-radio>
          <el-radio :label="0">
            等待审核
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
          v-if="isEdit"
          type="primary"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>

  emits: ['refreshDataList'],


var isEdit = ref(false)
var visible = ref(false)
var roleList = ref([])
var dataForm = reactive({
  prodCommId: null,
  prodId: null,
  orderItemId: null,
  userId: null,
  content: null,
  replyContent: null,
  recTime: null,
  replyTime: null,
  replySts: null,
  postip: null,
  score: null,
  usefulCounts: null,
  photoJson: null,
  isAnonymous: null,
  status: null
})
var dataRule = {
}
var resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL


const init  = (prodCommId, isEdit) => {
  isEdit = isEdit
  dataForm.prodCommId = prodCommId || 0
  visible = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.prodCommId) {
      http({
        url: http.adornUrl('/prod/prodComm/info/' + dataForm.prodCommId),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        dataForm = data
      })
    }
  })
}
// 表单提交
const onSubmit  = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/prod/prodComm'),
        method: dataForm.prodCommId ? 'put' : 'post',
        data: http.adornData(dataForm)
      }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}

</script>
