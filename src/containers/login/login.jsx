import React, {Component} from 'react'
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button,Toast} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {
  state={
    username:'',
    password:''
  }
  handleChange = (type,val)=>{
    this.setState({
      [type]:val
    })
  }
  login = ()=>{
    const {username,password}=this.state
    // 发送请求验证是否通过
    this.props.login({username,password})
  }
  toRegister = () => {
    this.props.history.replace('/register')
  }
  render() {
    const {redirectTo, msg} = this.props.user
    if(redirectTo) {// 查看状态信息中是否包含redirectto，有则需要自动重定向
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>叨叨小橘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? Toast.fail(msg, 1) : null}
            <InputItem
              placeholder='输入用户名'
              onChange={val => this.handleChange('username', val)}
            >
              用户名:
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              placeholder='输入密码'
              onChange={val => this.handleChange('password', val)}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace/>
            <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>注&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {login}
)(Login)