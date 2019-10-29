// 引入客户端io
import io from 'socket.io-client'
// 连接服务器，得到与服务器连接的socket对象
const socket=io('ws://localhost:4000')
//监听receiveMsg事件，接收服务器发送来的消息
socket.on('receiveMsg',function(data){
    console.log('.....')
})
//向服务器发送消息
socket.emit('sendMsg',{name:'evanism',idol:'evan'})