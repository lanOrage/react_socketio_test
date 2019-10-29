import React from 'react'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'
const Item = List.Item
const Brief = Item.Brief

class Personal extends React.Component {
  logout = () => {
    Modal.alert('退出', '确认退出该应用吗?', [
      {
        text: '取消',
      },
      {
        text: '确认',
        onPress: () => {
          const user = this.props.user
          // 删除redux中的user并且删除cookie
          this.props.resetUser()
          Cookies.remove('userid')
        }
      },
    ])
  }

  render() {
    const {username, post, salary, info, company, header} = this.props.user
    return (
      <div style={{marginTop: 50}}>
        <Result
          img={<img src={require(`../../assets/imgs/${header}.png`)} style={{width: 50}} alt="header"/>}
          title={username}
          message={company?company:null}
        />
        <List renderHeader={() => '个人信息'}>
          <Item multipleLine>
            <Brief>职位: {post}</Brief>
            <Brief>简介: {info}</Brief>
            {salary ? <Brief>薪资: {salary}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace/>
        <WhiteSpace/>
        <List>
          <Button type='warning' onClick={this.logout}>退出登录</Button>
        </List>
      </div>
    )
  }
}

export default connect(
  state =>({user: state.user}),
  {resetUser}
)(Personal)