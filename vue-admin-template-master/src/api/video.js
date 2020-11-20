import request from '@/utils/request'

export default {

  getVideoInfoById(id){
    return request({
      url:`/edu/service/video/info/${id}`,
      method:"get"
    })
  },
  deleteVideoById(id){
    return request({
      url:`/edu/service/video/delete/${id}`,
      method:"delete"
    })
  },
  saveVideo(video){
    return request({
      url:"/edu/service/video/add",
      method:"post",
      data:video
    })
  },
  updateVideo(video){
    return request({
      url:"/edu/service/video/update",
      method:"post",
      data:video
    })
  }
}
