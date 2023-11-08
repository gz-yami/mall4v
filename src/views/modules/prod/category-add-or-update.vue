<template>
  <el-dialog
    v-model:visible="visible"
    :title="!dataForm.currentId ? '新增' : '修改'"
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
        v-if="dataForm.type !== 2"
        label="分类图片"
        prop="pic"
      >
        <pic-upload v-model="dataForm.pic" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="分类名称"
        prop="categoryName"
      >
        <el-input
          v-model="dataForm.categoryName"
          controls-position="right"
          :min="0"
          label="分类名称"
        />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-cascader
          v-model="selectedCategory"
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          change-on-select
          :clearable="true"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="排序号"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          label="排序号"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        size="mini"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            下线
          </el-radio>
          <el-radio :label="1">
            正常
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="visible = false"
        >取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="dataFormSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { treeDataTranslate, idList } from '@/utils'
import PicUpload from '@/components/pic-upload'
import { Debounce } from '@/utils/debounce'
export default {

  components: {
    PicUpload
  },
  emits: ['refreshDataList'],

  data () {
    return {
      visible: false,
      dataForm: {
        categoryId: 0,
        currentId: 0,
        grade: 0,
        categoryName: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: ''
      },
      dataRule: {
        categoryName: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
          { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的分类名称', trigger: 'blur' }
        ],
        pic: [
          { required: true, message: '分类图片不能为空', trigger: 'blur' }
        ]
      },
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      isSubmit: false
    }
  },

  methods: {
    init (id) {
      this.dataForm.currentId = id || 0
      this.dataForm.categoryId = id || 0
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          this.selectedCategory = []
        })
      }).then(() => {
        if (this.dataForm.categoryId) {
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/prod/category/info/${this.dataForm.categoryId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.categoryId = data.categoryId
            this.dataForm.categoryName = data.categoryName
            this.dataForm.seq = data.seq
            this.dataForm.pic = data.pic
            this.dataForm.parentId = data.parentId
            this.dataForm.status = data.status
            this.selectedCategory = idList(this.categoryList, data.parentId, 'categoryId', 'children').reverse()
          })
        }
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      if (this.selectedCategory.length === 1) {
        this.dataForm.grade = 0
      }
      if (this.selectedCategory.length === 2) {
        this.dataForm.grade = 1
      }
      if (this.selectedCategory.length === 3) {
        this.dataForm.grade = 2
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/prod/category'),
            method: this.dataForm.categoryId ? 'put' : 'post',
            data: this.$http.adornData({
              categoryId: this.dataForm.categoryId || undefined,
              categoryName: this.dataForm.categoryName,
              status: this.dataForm.status,
              seq: this.dataForm.seq,
              grade: this.dataForm.grade,
              parentId: this.dataForm.parentId,
              pic: this.dataForm.pic
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.isSubmit = false
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    })
  }
}
</script>
