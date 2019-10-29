import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Redirect} from 'react-router-dom'
import {NavBar} from 'antd-mobile'
import Cookies from 'js-cookie'

import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'

import {getUser} from '../../redux/actions'
import {getRedirectPath} from '../../utils/getRedirectPath'

class Main extends Component {
    navList = [
        {
          path: '/laoban', // 路由路径
          component: Laoban,
          title: '大神列表',
          icon: 'dashen',
          text: '大神',
        },
        {
          path: '/dashen', // 路由路径
          component: Dashen,
          title: '老板列表',
          icon: 'laoban',
          text: '老板',
        },
        {
          path: '/message', // 路由路径
          component: Message,
          title: '消息列表',
          icon: 'message',
          text: '消息',
        },
        {
          path: '/personal', // 路由路径
          component: Personal,
          title: '用户中心',
          icon: 'personal',
          text: '个人',
        }
      ]
    componentDidMount(){
        // 有值就登录，但手里只有cookie中的userid，然后发请求登录，根据id获取用户信息，放在didmount中操作
        const userid=Cookies.get('userid')
        const user=this.props.user
        if(userid && !user._id){
            this.props.getUser()//后台自动读取cookie中的id不需要我们传参
        }
    }
    render(){

    // 检查用户以前是否登陆过——查看cookie（cookie有值完成自动登录
    const userid=Cookies.get('userid')
    if(!userid){//cookie没值，说明也没登录过，后台服务器也不返回cookie，直接去login界面
        return <Redirect to='/login'/>
    }
    // 检查当前是否已经登陆——查看redux（redux中是否值，有值在main，没值去login
    const {user} = this.props//从后台返回的数据中只要返回user都会返回_id
    if(!user._id) { // 当前还没有登陆
      return null // 暂时不做任何显示，完成render->componentDidMount，待获取完数据之后重新渲染
    }
    // 当前已经登陆了（cookie里又有值，redux也有user
    // 判断去哪个界面（主界面or信息完善界面
    const path = this.props.location.pathname  // 当前请求的path
    if(path==='/') { // 如果请求的是根路径, 自动跳转到对应的路由界面
      return <Redirect to={getRedirectPath(user.type, user.header)}/>
    }
    // 判断当前路径是否在navlist中，如果在，那么就需要显示navbar和navfooter
    // 首先确定用户类型是哪个，这样才知道主页面显示哪个，通过user.type可得
    let navList=this.navList
    if(user.type==='laoban'){
        navList[1].hide=true
    }else{
        navList[0].hide=true
    }
    // 得到当前需要显示的界面
    const currentNav=navList.find(nav=>nav.path===path)//找得到就返回，找不到即如果是完善信息界面返回undefined
    const {unreadCount}=this.props.chats
    return (
      <div>
        {currentNav ? <NavBar className='stick-header'>{currentNav.title}</NavBar>:null}        
        <Switch>
          <Route path='/dasheninfo' component={DashenInfo}/>
          <Route path='/laobaninfo' component={LaobanInfo}/>
          <Route path='/dashen' component={Dashen}/>
          <Route path='/laoban' component={Laoban}/>
          <Route path='/chat/:targetid' component={Chat}/>
          <Route path='/message' component={Message}/>
          <Route path='/personal' component={Personal}/>
          <Route component={NotFound}/>
        </Switch>
        {currentNav ? <NavFooter navList={navList} unreadCount={unreadCount}/>:null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user,chats:state.chats}),
  {getUser}
)(Main)