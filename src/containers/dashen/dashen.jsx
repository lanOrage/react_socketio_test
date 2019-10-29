import React, {Component} from 'react'
import {connect} from 'react-redux'
import UserList from '../../components/user-list/user-list'
import {getUserList} from '../../redux/actions'

// 这里通过发送异步请求获取用户列表，动态显示
class Dashen extends Component {

  componentDidMount () {
    this.props.getUserList('laoban')
  }

  render () {
    return <UserList userList={this.props.userList}/>
  }
}

export default connect(
  state =>({userList:state.userList}),
  {getUserList}
)(Dashen)