

let uid = 0;
export function Dialogs(vm, componentName = '', target, options = {}) {
  if (!vm.$msgbox) throw new Error('需要依赖element-ui msgbox组件')
  const msgbox = vm.$msgbox;
  const h = vm.$createElement;
  // 组件设置key以保证组件可以每次打开被更新
  options = Object.assign(options, { key: uid++ })
  if (typeof componentName === 'string') {
    let cpath = (componentName + '.vue').trim();
    // 由于import动态加载的限制问题 https://segmentfault.com/a/1190000015648036
    let __import__ = target === 'views' ? import('@/views' + cpath) : import('@/components' + cpath);
    // let target = 'views';
    // let __import__ = import(`../${target}${cpath}`) ;
    
    __import__.then(comp => {
      return msgbox({
        title: " ",
        message: h(comp.default, options)
      });
    })

  }
};


export let dialog = {
  install(Vue, opt) {
    Vue.prototype.$$dialog = function (...args) {
      console.log(this, 'create')
      return Dialogs(this, ...args);
    };
  }
}