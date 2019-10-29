import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'
export default class HeaderSelector extends Component {
  static propTypes = {
    setHeader: PropTypes.func.isRequired  //接收完善信息页面传递过来的设置头像方法
  }
  state = {
    icon: null//存的是一个头像对象，对象包括text和img
  }
  handleSelectHeader= ({text, icon}) =>{
    // 更新状态
    this.setState({icon})
    this.props.setHeader(text)
  }
  render () {
    const {icon} = this.state
    const header = !icon ? '请选择头像:' : <p>已选择头像:&nbsp;&nbsp;<img src={icon}/></p>
    const headers = []  //必须包括icon和text，固定格式
    for (var i = 0; i < 20; i++) {
      const text = '头像' + (i+1)
      const icon = require(`../../assets/imgs/${text}.png`)
      headers.push({text, icon})
    }
    return (
      <List renderHeader={() => header}>
        <Grid data={headers}
            columnNum={5}
            onClick={this.handleSelectHeader}
        />
      </List>
    )
  }
}