import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item
const Brief = Item.Brief

/*
根据chatMsg得到所有聊天的最后聊天msg的数组
// 1. 创建一个用于保存所有lastMsg的对象容器: lastMsgObjs {chat_id:lastMsg}
// 2. 遍历每个msg, 判断msg是否是它对应的聊天lastMsg, 如果是放入
// 3. 得到lastMsgObjs中所有属性值组成的数组: lastMsgs
// 4. 对lastMsgs按create_time进行降序排序
 */
/*每一条chatMsg包含：
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
*/ 
/*
关于统计每条msg是否已读：
首先它必须得是发送给我的，我才需要统计，
其次统计每条msg未读的情况下，将chat_id下的lastmsg数量加1
*/ 
function getLastMsgs(chatMsgs,user){
  // 1. 创建一个用于保存所有lastMsg的对象容器: lastMsgObjs {chat_id:lastMsg}
  let lastMsgObjs={}
  // let chatMsgs=this.props.chats.chatMsgs//会报错，告诉你undefined
  // 2. 遍历每个msg, 判断msg是否是它对应的聊天lastMsg, 如果是放入
  chatMsgs.forEach((chatMsg)=>{
    let chatId=chatMsg.chat_id
    // 统计msg自身的unReadCount
    if(!chatMsg.read && chatMsg.to===user._id){
      chatMsg.unReadCount=1 //若这条消息未读，count为1
    }else{
      chatMsg.unReadCount=0 //否则已读，count为0
    }
    if(!lastMsgObjs[chatId]){
      lastMsgObjs[chatId]=chatMsg
    }else{
      // 累加统计是否有未读消息，因为已经判断过每一条msg是否已读
      let unReadCount = lastMsgObjs[chatId].unReadCount+chatMsg.unReadCount
      if(lastMsgObjs[chatId].create_time<chatMsg.create_time){
        lastMsgObjs[chatId]=chatMsg
      }
      // 给最新的lastMsg指定unReadCount
      lastMsgObjs[chatId].unReadCount=unReadCount
    }
    
  })
  // 3. 得到lastMsgObjs中所有属性值组成的数组: lastMsgs
  const lastChatMsgs=Object.values(lastMsgObjs)
  // 4. 对lastMsgs按create_time进行降序排序
  lastChatMsgs.sort((msg1,msg2)=>{
    return msg2.create_time - msg1.create_time
  })
  return lastChatMsgs
}

class Message extends Component {
  render() {
    const {user, chats} = this.props
    const {users, chatMsgs} = chats
    const meId = this.props.user._id
    // 根据chatMsg得到所有聊天的最后聊天msg的数组
    const lastMsgs = getLastMsgs(chatMsgs,user)
    return (
      <List style={{marginTop: 50, marginBottom: 50}}>
        <QueueAnim type='scale' delay={100}>
          {
            lastMsgs.map((msg, index) => {  //消息列表没有：target_id但是可以通过判断消息的from和to来查看目标对象
              const targetId = msg.from===meId ? msg.to : msg.from///如果当前from和user._id想等那么说明此时发消息的人是我那么targetId就是msg.to那个user
              const targetUser = this.props.chats.users[targetId]
              const icon = targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`) : null
              return (
                <Item
                  key={msg._id}
                  extra={<Badge text={msg.unReadCount}/>}
                  thumb={icon}
                  arrow='horizontal'
                  onClick={() => this.props.history.push(`/chat/${targetId}`)}//这里因为users没有存_id所以通过chatMsg中from和to确定target对象是哪个然后获取其id
                >
                  <Brief>{targetUser.username}</Brief>
                  {msg.content}
                </Item>
              )
            })
          }
        </QueueAnim>
      </List>
    )
  }
}

export default connect(
  state =>({user: state.user,chats: state.chats}),
  {}
)(Message)