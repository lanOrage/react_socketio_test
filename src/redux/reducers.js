// 包含n个reducer函数的模块

import {combineReducers} from 'redux'


const initUser = {
    username: '',
    type: '',
    msg: '', // 错误信息
    redirectTo: '', // 需要自动重定向的path
}
function user(state=initUser,action){
    switch(action.type){
        default:
            return state
    }
}


// 向外暴露一个整合后产生的reducer
export default combineReducers({
    user,
})
  // 整合的reducer管理的状态: {user: {}}
  