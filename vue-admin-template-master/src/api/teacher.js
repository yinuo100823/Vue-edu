import request from '@/utils/request'

export default {
  getAllTeacher() {
    return request({
      url: `/edu/service/teacher/list`,
      method: 'get'
    })
  },
  getTeacherListByPage(pageNo, pageSize, queryMap) {
    return request({
      url: `/edu/service/teacher/list/${pageNo}/${pageSize}`,
      method: 'post',
      data: queryMap
    })
  },
  getTeacherInfoById(id){
    return request({
      url:`/edu/service/teacher/info/${id}`,
      method:"get"
    })
  },
  deleteTeacherById(id){
    return request({
      url:`/edu/service/teacher/delete/${id}`,
      method:"delete"
    })
  },
  saveTeacher(teacher){
    return request({
      url:"/edu/service/teacher/save",
      method:"post",
      data:teacher
    })
  },
  updateTeacher(teacher){
    return request({
      url:"/edu/service/teacher/update",
      method:"post",
      data:teacher
    })
  }
}
