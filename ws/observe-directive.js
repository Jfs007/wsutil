
let fn = null
let evts = null

export default function od (ws) {
  return {
    bind (el, binding, vnode) {
      let { value, modifiers } = binding || {}
      fn = value
      evts = modifiers
      for (let evt in evts) {
        if (evts[evt]) {
          ws.on('message:' + evt, fn)
        }
      }
    },
    unbind (el, binding, vnode) {
      for (let evt in evts) {
        if (evts[evt]) {
          ws.off('message:' + evt, fn)
        }
      }
    }
  }
}
