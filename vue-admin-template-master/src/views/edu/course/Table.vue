<template>
  <div class="course-list">
    <!--    讲师查询条件-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="queryMap.title" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryMap.status" clearable placeholder="请选择发布状态">
          <el-option value="Draft" label="未发布" key="Draft"/>
          <el-option value="Normal" label="已发布" key="Normal"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="queryMap.teacherId" clearable placeholder="请选择讲师">
          <el-option
            v-for="teacher in teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          >
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-select v-model="queryMap.subjectParentId"
                   clearable
                   placeholder="请选择一级分类"
                   @change="selectSecondSubject">
          <el-option
            v-for="subject in firstSubjects"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          >
          </el-option>
        </el-select>


        <el-select v-model="queryMap.subjectId" clearable placeholder="请选择二级分类">
          <el-option
            v-for="subject in secondSubjects"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!--      <el-form-item label="添加时间">-->
      <!--        <el-date-picker v-model="queryMap.begin" type="datetime" placeholder="选择开始时间"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-date-picker v-model="queryMap.end" type="datetime" placeholder="选择截止时间"/>-->
      <!--      </el-form-item>-->

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" @click="handleSave()">新建课程</el-button>
    </el-form>
    <!--    讲师列表-->
    <el-table :data="list" border fit>
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="title" label="课程名称"/>
      <el-table-column label="课程讲师">
        <template slot-scope="scope">
          {{ scope.row.teacherId|teacherName }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="发布状态" width="120">
        <template slot-scope="scope">
          {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="subjectId" label="课程分类">

        <template slot-scope="scope">
          {{ scope.row|subject }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数"/>
      <el-table-column prop="price" label="课程价格"/>
      <el-table-column prop="viewCount" label="浏览次数"/>
      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">基本信息</el-button>
          </router-link>
          <router-link :to="'/edu/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">章节信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    讲师分页-->
    <el-pagination
      @size-change="handlePageSizeChange"
      @current-change="handlePageNoChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 20px"
    >
    </el-pagination>

  </div>
</template>

<script>
import course from '../../../api/course'
import message from '../../../utils/message'
import teacher from '../../../api/teacher'
import subject from '../../../api/subject'

let teacherMap = new Map()
let firstSubjectMap = new Map()
let secondSubjectMap = new Map()
export default {
  name: 'table',
  data() {
    return {
      list: null,
      queryMap: { status: '', title: '', teacherId: '', subjectId: '', subjectParentId: '' },
      total: 0,
      pageNo: 1,
      pageSize: 10,
      teachers: [],
      firstSubjects: [],
      secondSubjects: []
    }
  },
  created() {
    this.getList()
    this.getTeacherMap()
    this.getSubjectMap()
  },
  methods: {
    getList() {
      course.getCourseListByPage(this.pageNo, this.pageSize, this.queryMap)
        .then(response => {
          const respData = response.data
          this.total = respData.data.total
          this.list = respData.data.rows
        })
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    handlePageNoChange(pageNo) {
      this.pageNo = pageNo
      this.getList()
    },
    resetData() {
      this.queryMap = {}
      this.secondSubjects = []
      this.getList()
    },
    handleSave() {
      this.$router.push({ name: 'CourseInfo' })
    },
    removeById(id) {
      message.messageBox(() => {
          course.deleteCourseById(id).then(resp => {
            message.messageByResp(resp)
            this.getList()
          })
        }
      )
    },

    getTeacherMap() {
      teacher.getAllTeacher().then(response => {
          this.teachers = response.data.data
          this.teachers.map(o => {
            teacherMap.set(o.id, o.name)
          })

        }
      )
    },
    getSubjectMap() {
      subject.getSubjectTree().then(response => {
        //把一级分类的id和name封装成map
        this.firstSubjects = response.data.items
        this.firstSubjects.map(o => {
          firstSubjectMap.set(o.id, o.title)
        })
        let sSubject = []
        this.firstSubjects.forEach(value => {
          value.children.forEach(value => {
            sSubject.unshift(value)
          })

        })
        sSubject.map(o => {
          secondSubjectMap.set(o.id, o.title)
        })
      })
    },
    selectSecondSubject(firstSubjectId) {
      this.firstSubjects.forEach((value, index, array) => {
        if (value.id === firstSubjectId) {
          this.secondSubjects = value.children
          this.queryMap.subjectId = ''//变更一级分类之后清空二级分类
        }
      })
    }
  },
  /**
   * 过滤器中不能使用data中的属性
   */
  filters: {

    teacherName(teacherId) {
      let teacherName = teacherMap.get(teacherId)
      if (teacherName === undefined) {
        teacherName = '查无此人'
      }
      return teacherName
    },
    subject(subject) {
      // console.log(firstSubjectMap)
      // console.log(secondSubjectMap)
      let firstSubjectName = firstSubjectMap.get(subject.subjectParentId)
      let secondSubjectName = secondSubjectMap.get(subject.subjectId)
      if (firstSubjectName === undefined) {
        firstSubjectName = ''
      }
      if (secondSubjectName === undefined) {
        secondSubjectName = ''
      }
      return firstSubjectName + '(' + secondSubjectName + ')'
    }
  }
}
</script>

<style scoped>

</style>
