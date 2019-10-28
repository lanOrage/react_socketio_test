import React, {Component} from 'react'
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button} from 'antd-mobile'
import {connect} from 'react-redux'

import Logo from '../../components/logo/logo'

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
  render() {
    return (
      <div>
        <NavBar>叨叨小橘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? <p className='error-msg'>{msg}</p> : null}
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
            <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>注&nbsp;&nbsp;&nbsp;册</Button>
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