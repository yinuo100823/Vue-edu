<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'static/subject.xls'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/edu/service/subject/add'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import message from '../../../utils/message'

export default {
  name: 'Save',
  data() {
    return {
      BASE_API: process.env.BASE_API,
      fileUploadBtnText: '上传到服务器',
      importBtnDisabled: false,
      loading: false
    }
  },
  methods: {
    fileUploadSuccess(resp) {
      message.messageByResp(resp, '上传成功')
      this.importBtnDisabled = false
      this.fileUploadBtnText = '上传到服务器'
      this.loading = false
      this.$router.push({name:"SubjectTable"})
    },
    fileUploadError(resp) {
      message.messageByResp(resp, '上传失败')
      this.importBtnDisabled = false
      this.loading = false
      this.fileUploadBtnText = '上传到服务器'
    },
    submitUpload() {
      this.fileUploadBtnText = '正在上传，请稍等'
      this.importBtnDisabled = true
      this.loading = true
      console.log(this.$refs.upload)
      this.$refs.upload.submit()
    }

  }
}
</script>

<style scoped>

</style>
