import request from '@/utils/request'

export default {

  getCourseListByPage(pageNo, pageSize, queryMap) {
    return request({
      url: `/edu/service/course/list/${pageNo}/${pageSize}`,
      method: 'post',
      data: queryMap
    })
  },
  getCourseInfoById(id){
    return request({
      url:`/edu/service/course/info/${id}`,
      method:"get"
    })
  },
  deleteCourseById(id){
    return request({
      url:`/edu/service/course/delete/${id}`,
      method:"delete"
    })
  },
  saveCourse(course){
    return request({
      url:"/edu/service/course/addCourse",
      method:"post",
      data:course
    })
  },
  updateCourse(Course){
    return request({
      url:"/edu/service/course/update",
      method:"post",
      data:Course
    })
  },
  getCoursePublishInfoById(id){
    return request({
      url:`/edu/service/course/publish/info/${id}`,
      method:"get"
    })
  },

  publishCourse(id,status){
    return request({
      url:`/edu/service/course/publish/${id}`,
      method:"post",
      data:status
    })
  }
}
