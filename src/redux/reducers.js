import {combineReducers} from 'redux'
import {LOGIN_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,
        RECEIVE_USER_LIST,
        RECEIVE_CHAT,RECEIVE_MSG,
        MSG_UPDATE
} from './action-types'
import {getRedirectPath} from '../utils/getRedirectPath'

const initUser = {
    username: '',
    type: '',
    msg: '', // 错误信息
    redirectTo: '', // 需要自动重定向的path
}
function user(state=initUser,action){
    switch(action.type){
        case LOGIN_SUCCESS:
            // 判断登录的页面具体跳转到哪里
            return {...action.data,redirectTo:getRedirectPath(action.data.type,action.data.header)}
        case ERROR_MSG:
            return {...state,msg:action.data}
        case RECEIVE_USER:  //返回不一样的状态，包含新增属性
            return action.data
        case RESET_USER:
            return {...initUser,msg:action.data}
        default:
            return state
    }
}

const initUserList = []
function userList(state=initUserList,action){
    switch(action.type){
        case RECEIVE_USER_LIST:
            return action.data  //直接返回从后台获取的用户列表
        default:
            return state
    }
}

const initChats = {
    users: {},  // 所有用户信息(包括username/header)的集合对象，key为user的_id, val为name和header组成的user对象
    chatMsgs: [], // 当前用户相关(from/to)的所有聊天msg的数组，内容具体格式看model中定义的文档结构
    unreadCount:0
}
function chats(state=initChats,action){
    switch(action.type){
        case RECEIVE_CHAT://data：{users，chatMsgs,meid}
            return {
                users:action.data.users,
                chatMsgs:action.data.chatMsgs,
                unreadCount:action.data.chatMsgs.reduce((precount,chatMsg)=>{
                    return precount+(!chatMsg.read && chatMsg.to===action.data.meid ? 1 : 0)
                },0)
            }

        case RECEIVE_MSG://data:{chatMsg,meid}
            return {
                users:state.users,
                chatMsgs:[...state.chatMsgs,action.data.chatMsg],
                unreadCount:state.unreadCount+(!action.data.chatMsg.read && action.data.chatMsg.to===action.data.meid ? 1 : 0)
            }

        case MSG_UPDATE://data:{count:result.data, from ,meid}))
            const {from, meid,count}=action.data
            return {
                users:state.users,
                // 根据from, to在chatMsgs中找到所有对应的msg, 将read属性改为true
                chatMsgs:state.chatMsgs.map((chatMsg)=>{
                    if(chatMsg.from===from && chatMsg.to===meid && !chatMsg.read){
                        return {...chatMsg,read:true}
                    }else{
                        return {...chatMsg}
                    }
                }),
                unreadCount:state.unReadCount - count
            } 
        default:
            return state
    }
}


export default combineReducers({
    user,
    userList,
    chats
})