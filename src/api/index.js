// 发送请求的函数集合'
import ajax from './ajax'

export const reqLogin = ({username,password})=>ajax('/login',{username,password},'POST')