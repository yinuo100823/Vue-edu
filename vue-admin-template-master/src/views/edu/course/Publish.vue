<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="添加课程基本信息"></el-step>
      <el-step title="添加课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}
          (
          <em style="color: red">{{ coursePublish.status === 'Normal' ? '已发布' : '未发布' }} </em>
          )
        </h2>
        <p class="gray">共<span style="color: red">{{ coursePublish.lessonNum }}</span>课时</p>
        <p><span>所属分类：{{ coursePublish.firstSubject }} — {{ coursePublish.secondSubject }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="back">返回修改</el-button>
      <el-button v-if="coursePublish.status==='Draft'" type="primary" @click="publish">发布课程</el-button>
      <el-button v-else type="primary" @click="unPublish">撤销课程</el-button>
    </div>
  </div>
</template>

<script>
import message from '../../../utils/message'
import course from '../../../api/course'

export default {
  name: 'Publish',
  data() {
    return {
      active: 3,
      courseId: null,
      coursePublish: {},
      publishStatus: false,
      status: {}
    }
  },
  created() {
    const params = this.$route.params
    if (params && params.id) {
      this.courseId = params.id
      this.getCoursePublishInfoById()
    }
  },
  methods: {
    publish() {
      message.messageBox(() => {
        course.publishCourse(this.courseId, { status: 'Normal' }).then(response => {
          message.messageByResp(response)
          //回到课程列表页
          this.$router.push({ name: 'CourseTable' })
        })
      }, '请检查各项信息，是否确认无误？')
    },
    unPublish() {
      message.messageBox(() => {
        course.publishCourse(this.courseId, { status: 'Draft' }).then(response => {
          message.messageByResp(response)
          //回到课程列表页
          this.$router.push({ name: 'CourseTable' })
        })
      }, '是否确认撤销课程，撤销后前端将不再显示该课程？')
    },

    back() {
      this.$router.push({ path: `/edu/course/chapter/${this.courseId}` })
    },
    getCoursePublishInfoById() {
      course.getCoursePublishInfoById(this.courseId).then(response => {
        if (response.code === 20000) {
          this.coursePublish = response.data.data
          console.log(this.coursePublish)
        } else {
          message.messageByResp(response)
        }

      })
    }
  }
}
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>
