import request from '@/utils/request'

export default {
  getSubjectTree() {
    return request({
      url: `/edu/service/subject/list`,
      method: 'get'
    })
  }
}
