// 发送请求的函数集合'
import ajax from './ajax'

export const reqLogin = ({username,password})=>ajax('/login',{username,password},'POST')
export const reqRegister = (user)=>ajax('/register',user,'POST')
export const reqUpdateUser = (user)=>ajax('/update',user,'POST')//根据cookie中找到userid确认对应需完善的用户信息（传递的user是要完善的部分
export const reqUser = ()=>ajax('/user')

export const reqUserList = (type)=> ajax('/userlist',{type})

// 找出所有的users和与当前用户相关的聊天记录包括from和to
export const reqAllusersAndChats = ()=>ajax('/msglist')

// 发送请求更改msg的未读消息,更改的是别人发给我的消息，to是我，所以从cookie中获取不需要传递参数，
// from是目标对象
export const reqUpdateMsg = (from)=>ajax('/readmsg',{from},'POST')