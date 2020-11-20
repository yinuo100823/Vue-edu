import { Message, MessageBox } from 'element-ui'

export default {
  /**
   * 确认窗
   * @param message
   * @param func
   */
  messageBox(func, message = '请确认您的操作') {
    MessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(func).catch(error => {
      return false
    })
  },
  /**
   * 根据response响应信息提示用户
   * @param respData
   * @param type:1、新增；2、修改；3、删除，默认=1
   */
  messageByResp(respData, message = '操作成功') {
    Message({ type: respData.code === 20000 ? 'success' : 'error', message: respData.message || message })
  }

}

