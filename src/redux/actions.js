import {reqLogin,reqRegister,reqUser,reqUpdateUser,
        reqUserList,
        reqAllusersAndChats,
        reqUpdateMsg
} from '../api/index'
import {LOGIN_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,
        RECEIVE_USER_LIST,
        RECEIVE_CHAT,RECEIVE_MSG,
        MSG_UPDATE
} from './action-types'

// 引入客户端io
import io from 'socket.io-client'
// 连接服务器，得到与服务器连接的socket对象
const socket=io('ws://localhost:4000')

const loginSuccess = (user)=>({type:LOGIN_SUCCESS,data:user})
const errorMsg = (msg)=>({type:ERROR_MSG,data:msg})
const receiveUser = (user)=>({type:RECEIVE_USER,data:user})
export const resetUser = (msg)=>({type:RESET_USER,data:msg})

// 登录的异步action
export const login = ({username,password})=>{
    // 登录前需要判断一下是否输入指定的数据
    if(!username) {
        return errorMsg('必须指定用户名！')
    } else if(!password) {
        return errorMsg('必须指定密码！')
    }
    return async dispatch=>{
        // 发送异步请求，后台验证是否登录成功
        const response = await reqLogin({username,password})
        const result =response.data
        if(result.code===0){
            const user=result.data
            // 成功，分发一个成功的action，跳转页面，并保存user信息
            /*
            res.cookie('userid', userDoc._id, {maxAge: 1000*60*60*24*7}) //指定maxAge持久化cookie
            res.send({
                code: 0,
                data: userDoc
            })
            */ 
            getReceiveChats(result.data._id,dispatch)
            dispatch(loginSuccess(user))
        }else{
            // 说明登录信息有误
            /*
            res.send({
                "code": 1,
                "msg": "用户名或密码错误"
            })
            */ 
            dispatch(errorMsg(result.msg))
        }
    }
}
// 注册的异步action
export const register = (user)=>{
    const {username,password,password2,type}=user
    if(!username) {
        return errorMsg('必须指定用户名！')
    } else if(!password) {
        return errorMsg('必须指定密码！')
    } else if(password!==password2) {
        return errorMsg('两个密码必须一致') 
    }
    return async dispatch=>{
        // 发送注册请求
        const {username, password, type}=user
        const response = await reqRegister({username, password, type})//register组件是直接传递整个state。所以这里要取
        const result=response.data // {code: 0/1: data/msg: ???}
        if(result.code===0){
            // 说明注册成功，注册成功就可以直接跳转到信息完善界面
            getReceiveChats(result.data._id,dispatch)
            dispatch(loginSuccess(user))   
        }else{
            // 注册失败,原因可能是数据库里已经存在该用户
            dispatch(errorMsg(result.msg))
        }
    }
}
// 更新用户的异步action
export const updateUser = (user)=>{
    return async dispatch=>{
        const response = await reqUpdateUser(user)
        const result = response.data
        if(result.code===0){
            dispatch(receiveUser(result.data))//从后台返回回来的数据包括了_id，username，type等，这是后台处理合并用户信息之后返回给前台的
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
// 根据cookie中userid获取对应用户信息, 实现自动登陆
export const getUser = ()=>{
    return async dispatch=>{
        const response = await reqUser()
        const result = response.data
        if(result.code===0){
            getReceiveChats(result.data._id,dispatch)
            dispatch(receiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}

// -------------------------------------------------------------------------------------------
const receiveUserList = (users)=>({type:RECEIVE_USER_LIST,data:users})

// 获取用户列表
export const getUserList = (type)=>{
    return async dispatch=>{
        const response = await reqUserList(type)
        const result=response.data
        if(result.code===0){
            dispatch(receiveUserList(result.data))
        }
    }
}

// -------------------------------------------------------------------------------------------
const receiveChat = (data,meid)=>({type:RECEIVE_CHAT,data:{...data,meid}})
const receiveMsg = (chatMsg,meid)=>({type:RECEIVE_MSG,data:{chatMsg,meid}})

// 最关键的在初始化socketio,只需要一次监听，以后都能使用
async function initSocketIO(meid,dispatch){
    if(!io.socket) {//单例对象：这里得判断是否存在该对象
        io.socket = socket
        socket.on('receiveMsg',function(chatMsg){
            // 在服务器那边分发给所有连接上的浏览器聊天消息io.emit('receiveMsg', chatMsgDoc)
            // 而浏览器这边负责过滤再显示，这里回调函数中的参数就是返回给我们的chatMsgDoc
            // 通过判断返回的chatMsg到底是否和我相关来决定要是否分发receiveMsg(chatMsg, userid)来保存消息到时候显示
            // 这个接收到的一条消息
            if(chatMsg.from===meid || chatMsg.to===meid) {
                dispatch(receiveMsg(chatMsg, meid))
            }
        })
    }
}

export const getReceiveChats = async (meid,dispatch)=>{
    // 三种情况:getUser实现自动登录时，成功登陆时，注册成功时就可以获取所有的聊天记录
    initSocketIO(meid, dispatch)///初始化socketio，这里创建单例对象
    const response = await reqAllusersAndChats()
    const result = response.data
    if(result.code===0){
        dispatch(receiveChat(result.data,meid))
    }
}

// 发送一个消息
export const sendMsg = ({from,to,content})=>{
    return dispatch=>{
        socket.emit('sendMsg',{from,to,content})
    }
}

// -------------------------------------------------------------------------------------------
const updateMsg = ({count,from,meid})=>({type:MSG_UPDATE,data:{count,from,meid}})

// 更改未读消息的数量
export const updateUnreadCount = (from,meid)=>{
    return async dispatch=>{
        const response = await reqUpdateMsg(from)
        const result = response.data
        if(result.code===0){
            dispatch(updateMsg({count:result.data, from ,meid}))
        }
    }
}