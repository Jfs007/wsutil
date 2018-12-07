
// websocket
let ws = null
// 心跳检测
let heartCheck = {
  _heartBeat: 'heartBeat',
  timeout: 35000, //
  timeoutObj: null,
  // 重连上限次数，，如果重连10未成功将停止
  reconnectLimit: 10,
  reconnectNumber: 0,
  reset: function () {
    clearTimeout(this.timeoutObj)
    this.start()
  },
  start: function () {
    this.timeoutObj = setTimeout(() => {
      ws.send(this._heartBeat)
    }, this.timeout)
  }
}

let connect = (url, username, _event) => {
  let ws = new WebSocket(url + '/' + username)
  ws.onopen = function (evt) {
    heartCheck.start()
    _event.$emit('ws:open', evt)
  }
  // 出错的是啥时候
  ws.onerror = function (evt) {
    ws.close()

    _event.$emit('ws:error', evt)
  }
  ws.onmessage = function (evt) {
    heartCheck.reset()
    _event.$emit('ws:message', evt)
    // _event.$emit()
  }
  ws.onclose = function (evt) {
    setTimeout(() => {
      // 尝试重连
      reconnect(url, username, _event)
    }, 1000)
    _event.$emit('ws:close', evt)
  }
  return ws
}
// 断线重连
let reconnect = (url, username, _event) => {
  // 超过限制次数
  // if (heartCheck.reconnectNumber > heartCheck.reconnectLimit) return
  _event.$emit('ws:reconnect')
  // heartCheck.reconnectNumber++
  ws = connect(url, username, _event)
}

// ws.onopen = function () {
//   heartCheck.start()
// }

// ws.onmessage = function (event) {
//   heartCheck.reset()
// }

/**
 *
 *
 *
 *
 *
 *
 */

export default function websocket (Vue, opts = {}) {
  let { url, username = 'u' } = opts
  let _event = new Vue()
  ws = connect(url, username, _event)

  return {
    on: _event.$on.bind(_event),
    off: _event.$off.bind(_event),
    emit: _event.$emit.bind(_event),
    io: ws,
    _event,
    username
  }
}
