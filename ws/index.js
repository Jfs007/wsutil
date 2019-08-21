import dObserve from './observe-directive'
import wsocket from './ws'

function msgTransfer (evt, ws) {
  let { data } = evt
  try {
    data = JSON.parse(data)
  } catch (error) {
    data = {
      code: 100,
      username: ws.username,
      type: '',
      msg: data
    }
  } finally {

  }

  let { code, username } = data
  code = +code
  let msg = {
    evtName: '',
    data: data.msg,
    code,
    username
  }
  switch (code) {
    case 100:
      msg.evtName = 'system'
      break
    case 101:
      msg.evtName = 'open'
      break
    case 102:
      msg.evtName = 'redirect'
      break
    case 103:
      msg.evtName = 'message:' + data.function
      msg.data = data.params
      break
    case 104:
      msg.evtName = 'outchain'
      break
    default:
      msg.evtName = 'system'
  }
  return msg
}
// let wsEvent = [''];
// 

// 

// https://cn.vuejs.org/v2/guide/plugins.html
export default {

  /**
   *  规定消息格式
   * {
   *  // 默认message可以不传，如果传递该evtName 就会对指定的一个事件目标
   *  evtName: 'message',
   *  data: {
   *    // 类型 是打开还是跳转类型
   *    type: 'open/redirect',
   *    // 地址url
   *    url: ''
   *
   *  }
   * }
   */

  install: function (Vue, opt) {
    let ws = wsocket(Vue, opt)
    // 处理message消息
    ws.on('ws:message', (evt) => {
      let data = msgTransfer(evt, ws)
      console.log(data, 'ws消息')
      ws.emit(data.evtName, data.data, data)
    })
    // ws.on('ws')
    // socket
    Vue.prototype.$$socket = ws
    Vue.directive('dobserve', dObserve(ws))
  }
}
