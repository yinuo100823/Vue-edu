<template>
  <div class="teacher">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调
        <input type="file" name="file"/>
      -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/edu/oss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '../../../api/teacher'
import message from '../../../utils/message'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'Save',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        avatar:"https://edu100823.oss-cn-shanghai.aliyuncs.com/2020/11/10/8341f2a9c389416ba825f402430b2280file.png"
      },
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,
      BASE_API:process.env.BASE_API,
    }
  },
  created() {
    this.init()
  },
  methods: {

    save() {
      teacherApi.saveTeacher(this.teacher).then(response => {
        message.messageByResp(response)
        if (response.success) {
          this.$router.push({ name: 'TeacherTable' })
        }
      }).catch(response => {
        this.saveBtnDisabled=false
      })
    },
    update() {
      teacherApi.updateTeacher(this.teacher).then(response => {
        message.messageByResp(response)
        if (response.success) {
          this.$router.push({ name: 'TeacherTable' })
        }
      }).catch(response => {
        this.saveBtnDisabled=false
      })
    },

    saveOrUpdate() {
      if (!this.teacher.id) {
        this.save()
      } else {
        this.update()
      }
    },
    getTeacherInfo(id) {
      teacherApi.getTeacherInfoById(id).then(response => {

        this.teacher = response.data.data
      })
    },

    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getTeacherInfo(id)
      }
    },
    close(){
      this.imagecropperShow=false
    },
    cropSuccess(data){
      this.teacher.avatar=data.data
      console.log("==========上传头像",data.data)
      this.imagecropperShow=false
      this.imagecropperKey=this.imagecropperKey+1
    }

  }
}
</script>

<style scoped>

</style>
