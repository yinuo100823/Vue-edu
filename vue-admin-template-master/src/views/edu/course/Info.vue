<template>
  <div class="course-info">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="添加课程基本信息"></el-step>
      <el-step title="添加课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>
    <el-form label-width="120px" style="margin-top: 30px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程讲师-->
      <el-form-item label="讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          >
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="课程分类">
        <!-- 课程一级分类-->
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择一级分类" @change="selectSecondSubject">
          <el-option
            v-for="firstSubject in firstSubjects"
            :key="firstSubject.id"
            :label="firstSubject.title"
            :value="firstSubject.id"
          >
          </el-option>
        </el-select>
        <!-- 课程二级分类-->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择二级分类">
          <el-option
            v-for="secondSubject in secondSubjects"
            :key="secondSubject.id"
            :label="secondSubject.title"
            :value="secondSubject.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="1" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>


      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          class="avatar-uploader"
          :action="BASE_API+'/edu/oss/file/upload'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

      </el-form-item>


      <!-- 课程简介-->
      <el-form-item label="课程描述">
        <Tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdateAndNext">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '../../../api/course'
import message from '../../../utils/message'
import teacher from '../../../api/teacher'
import subject from '../../../api/subject'
import Tinymce from '../../../components/Tinymce'

const courseForm = {
  title: '',
  subjectParentId: '',
  subjectId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '',
  price: 0
}
export default {
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      active: 1,
      courseInfo: courseForm,
      saveBtnDisabled: false,
      teachers: [],
      firstSubjects: [],
      secondSubjects: [],
      BASE_API: process.env.BASE_API,
      courseId: ''
    }
  },
  created() {
    this.getAllTeacher()
    this.getAllSubject()
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCourseInfoById()
    } else {
      this.courseInfo = { ...courseForm }
    }
  },
  methods: {
    saveOrUpdateAndNext() {
      if (this.courseId) {
        course.updateCourse(this.courseInfo).then(response => {
          message.messageByResp(response)
          if (response.code === 20000) {
            //2.跳转路由到添加课程大纲
            this.$router.push({ path: `/edu/course/chapter/${this.courseId}` })
          }
        })
      } else {
        //1.调用接口，保存课程基本信息和描述信息
        course.saveCourse(this.courseInfo).then(response => {
          message.messageByResp(response)
          if (response.code === 20000) {
            //2.跳转路由到添加课程大纲
            this.$router.push({ path: `/edu/course/chapter/${response.data.courseId}` })
          }
        }).catch(error => {
        })
      }

    },
    getAllTeacher() {
      teacher.getAllTeacher().then(response => {
        this.teachers = response.data.data
      }).catch(error => {
      })
    },
    getAllSubject() {
      subject.getSubjectTree().then(response => {
        this.firstSubjects = response.data.items
      })
    },
    //根据一级分类ID查找其二级分类
    selectSecondSubject(firstSubjectId) {
      this.firstSubjects.forEach((value, index, array) => {
        if (value.id === firstSubjectId) {
          this.secondSubjects = value.children
          this.courseInfo.subjectId = ''//变更一级分类之后清空二级分类
        }
      })
    },

    handleAvatarSuccess(resp, file) {
      this.courseInfo.cover = resp.data.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      console.log('文件校验是否通过', isJPG && isLt2M)
      return isJPG && isLt2M
    },

    getCourseInfoById() {
      course.getCourseInfoById(this.courseId).then(response => {
        this.courseInfo = response.data.data
        //1.调用分类接口，获取所有的一级分类和二级分类
        subject.getSubjectTree().then(subjectResp => {
          //2.遍历一级分类
          subjectResp.data.items.forEach((value, index, array) => {
            //3.如果一级分类和当前courseInfo的subjectParentId一致，则把一级分类的children赋值给secondSubjects
            if (value.id === this.courseInfo.subjectParentId) {
              this.secondSubjects = value.children
            }
          })

        })

        //初始化二级分类，根据一级分类数组中的ID与 当前courseInfo中的Id进行对比，如果一致则把该一级分类的children赋值给this.secondSubjects

      })
    }

  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.tinymce-container {
  line-height: 29px;
}
</style>
