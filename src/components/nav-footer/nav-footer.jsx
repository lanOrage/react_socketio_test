import React, {Component} from 'react'
import {TabBar,Badge} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

import '../../assets/css/index.less'
const Item = TabBar.Item

class NavFooter extends Component {

  static propTypes = {
    navList: PropTypes.array.isRequired,
    unreadCount: PropTypes.number.isRequired
  }
  render () {
    // 对navList进行过滤
    let navList = this.props.navList.filter(nav=>!nav.hide)
    // 得到请求的路径
    const path = this.props.location.pathname
    const {unreadCount} = this.props
    return (
      <TabBar>
        {
          navList.map((nav, index) =>(
            <Item key={index}
                  title={nav.text}
                  icon={{ uri: require(`./imgs/${nav.icon}.png`)}}
                  selectedIcon={{uri: require(`./imgs/${nav.icon}-selected.png`)}}
                  selected={nav.path===path}
                  badge={nav.path==='/message' ? unreadCount : 0}
                  onPress={() => this.props.history.replace(nav.path)}
            />
          ))
        }
      </TabBar>
    )
  }
}

export default withRouter(NavFooter)