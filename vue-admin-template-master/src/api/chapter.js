import request from '@/utils/request'

export default {
  //添加课程信息
  getChapterList(courseId) {
    return request({
      url: `/edu/service/chapter/list/${courseId}`,
      method: 'get'
    })
  },
  getChapterInfoById(id){
    return request({
      url:`/edu/service/chapter/info/${id}`,
      method:"get"
    })
  },
  deleteChapterById(id){
    return request({
      url:`/edu/service/chapter/delete/${id}`,
      method:"delete"
    })
  },
  saveChapter(chapter){
    return request({
      url:"/edu/service/chapter/add",
      method:"post",
      data:chapter
    })
  },
  updateChapter(chapter){
    return request({
      url:"/edu/service/chapter/update",
      method:"post",
      data:chapter
    })
  }
}
