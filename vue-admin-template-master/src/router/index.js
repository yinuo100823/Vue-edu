import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import TeacherTable from '../views/edu/teacher/Table'
import TeacherSave from '../views/edu/teacher/Save'
import Dashboard from '../views/dashboard'
import Login from '../views/login'
import _404 from '../views/404'
import SubjectSave from '../views/edu/subject/Save'
import SubjectTable from '../views/edu/subject/Table'
import CourseTable from '../views/edu/course/Table'
import CourseInfo from '../views/edu/course/Info'
import CourseChapter from '../views/edu/course/Chapter'
import CoursePublish from '../views/edu/course/Publish'

export const constantRouterMap = [
  { path: '/edu/login', component: Login, hidden: true },
  { path: '/404', component: _404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/edu/teacher/table',
    name: 'Dashboard',
    hidden: false,
    meta: { title: '首页', icon: 'example' },
    children: [{
      path: 'dashboard',
      component: Dashboard,
      meta: { title: '首页', icon: 'example' },
    }]
  },
  {
    path: '/edu/teacher',
    // alwaysShow:true,
    component: Layout,
    redirect: '/edu/teacher/table',
    name: 'TeacherManage',
    meta: { title: '讲师管理', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'TeacherTable',
        component: TeacherTable,
        meta: { title: '讲师列表', icon: 'table' }

      },
      {
        path: 'save',
        name: 'TeacherSave',
        component: TeacherSave,
        meta: { title: '新建讲师', icon: 'tree' },
        hidden: true
      },
      {
        path: 'update/:id',
        name: 'TeacherUpdate',
        component: TeacherSave,
        meta: { title: '编辑讲师', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/edu/course',
    component: Layout,
    redirect: '/edu/course/table',
    name: 'CourseManage',
    // alwaysShow: true,
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'CourseTable',
        component: CourseTable,
        meta: { title: '课程列表', icon: 'table' }

      },
      {
        path: 'info',
        name: 'CourseInfo',
        component: CourseInfo,
        meta: { title: '新建课程', icon: 'tree' },
        hidden: true
      },
      {
        path: 'info/:id',
        name: 'CourseUpdate',
        component: CourseInfo,
        meta: { title: '编辑课程', icon: 'tree' },
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'CourseChapter',
        component: CourseChapter,
        meta: { title: '添加课程章节', icon: 'tree' },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'CoursePublish',
        component: CoursePublish,
        meta: { title: '课程发布', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/edu/subject',
    component: Layout,
    redirect: '/edu/subject/table',
    name: 'SubjectManage',
    // alwaysShow: true,
    meta: { title: '课程分类管理', icon: 'table' },
    children: [
      {
        path: 'table',
        name: 'SubjectTable',
        component: SubjectTable,
        meta: { title: '课程分类列表', icon: 'table' }

      },
      {
        path: 'save',
        name: 'SubjectSave',
        component: SubjectSave,
        meta: { title: '新建课程分类', icon: 'tree' },
        hidden:true
      }
    ]
  },


  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
