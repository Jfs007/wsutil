// . ..
console.log('文件执行=========')
export default function notify(title, body) {
  // console.log(Notification, 'Notification')
  if (Notification) {
    Notification.requestPermission()
    if (Notification.permission === 'granted') {
      // console.log(title, 'bodu')
      new Notification(title, {
        body: body,
        // icon: 'mm1.jpg'

        
        

        // 
      });



    }
    

  }
}