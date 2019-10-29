import React,{Component} from 'react'
import {NavBar, List, InputItem, Icon, Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import QueueAnim from 'rc-queue-anim'

import {sendMsg,updateUnreadCount} from '../../redux/actions'

const Item = List.Item

const emojis = [
'😀', '😁', '🤣' ,'😀' ,'🤓' ,'💀' ,'🤮' ,
'😂' ,'🙂' ,'🙃' ,'😉' ,'😊' ,'😎' ,'😅' ,
'😇' ,'🥰' ,'😍' ,'😗' ,'😚' ,'😙' ,'😋' ,
'😜' ,'🤑' ,'🤫' ,'🤔' ,'🤐' ,'😐' ,'😈' ,
'😶' ,'😒' ,'🙄' ,'😬' ,'🤥' ,'😌' ,'😔' ,
'😪' ,'🤤' ,'😴' ,'😷' ,'🤒' ,'🤕' ,'👿' ,
'🤮' ,'🤧' ,'🥴' ,'😵' ,'🤯' ,'🤠' ,'🥳' ,
'😰' ,'😥' ,'😢' ,'😭' ,'😖' ,'😣' ,'😞' ,
'😓' ,'😩' ,'😫' ,'😤' ,'😡' ,'😠' ,'🤬' ,
]

class Chat extends Component{
    state={
        content:'',  //用户输入的聊天信息
        isShow:false    //一开始不显示
    }
    send = ()=>{

        const from = this.props.user._id
        const to = this.props.match.params.targetid
        const content = this.state.content
        if(!content) {
            return
        }// 1、发送消息——明确谁发给谁，然后发送请求
        this.props.sendMsg({from,to,content})

        // 2、清空input中的内容
        this.setState({
            content:'',
            isShow:false 
        })
    }
    isShow = ()=>{
        let isShow=true;
        this.setState({isShow})//注意setstate异步更新问题，
        if(isShow) {
            // 异步手动派发resize事件,解决表情列表显示的bug
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }
    
    componentWillMount(){
        // 这里初始化表情网格组件
        this.emojis=emojis.map(emoji=>({text:emoji}))
    }
    // 打开界面, 自动滚动到底部
    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }
    // 更新后, 自动滚动到底部
    componentDidUpdate(){
        // 更新列表的显示
        window.scrollTo(0,document.body.scrollHeight)
    }
    componentWillUnmount(){
        let target_id = this.props.match.params.targetid
        let user = this.props.user
        this.props.updateUnreadCount(target_id,user._id)
    }
    render(){
        const{user}=this.props
        const {users,chatMsgs}=this.props.chats
        let target_id = this.props.match.params.targetid
        if(!users[target_id]) {//解决直接刷新当前页面会出错的问题，
            // 原因是users对象是异步获取，所以直接进行下面的操作时会取不到值。
            // users对象一开始为空，所以当前如果取不到目标对象那么就不做任何展现
            return null // 不做任何显示
        }
        let chatId = [target_id,this.props.user._id].sort().join('-')   //计算与当前用户聊天的chatId
        this.currentchatMsgs=chatMsgs.filter(chatMsg => chatMsg.chat_id===chatId)
        const targetUser = users[target_id]
        const targetIcon=targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`):null
        const meIcon=user.header? require(`../../assets/imgs/${user.header}.png`):null
        
        return (
            <div id='chat-page'>
                <NavBar 
                    icon={<Icon type='left'/>}
                    onLeftClick={() => {
                        this.props.history.goBack()
                    }}
                    className="stick-header"
                >
                    {targetUser.username}
                </NavBar>       
                <List style={{marginBottom: 50,marginTop: 50}}>
                    {/* 和xxx的聊天列表 */}
                    {/* <QueueAnim type='left' delay={50}> */}
                        {
                            this.currentchatMsgs.map(chatMsg=>{
                                if(chatMsg.from===target_id){
                                    return (<Item
                                        key={chatMsg._id}
                                        thumb={targetIcon}
                                    >
                                        {chatMsg.content}
                                    </Item>)
                                }else if(chatMsg.to===target_id){
                                    return (<Item
                                        key={chatMsg._id}
                                        thumb={meIcon}
                                        className='chat-me'
                                    >
                                        {chatMsg.content}
                                    </Item>)
                                }
                            })
                        }
                    {/* </QueueAnim> */}
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={content => this.setState({content})}
                        extra={
                            <div>
                              <span onClick={this.isShow}>😊&nbsp;</span>
                              <span onClick={this.send} style={{marginLeft:15}}>发送</span>
                            </div>
                        }
                    />

                    {   //表情列表
                        this.state.isShow ? (
                        <Grid
                            data={this.emojis}
                            columnNum={7}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={val=>this.setState({content:this.state.content+val.text})}//点击每一个表情都将输出到input中
                        />
                        ) : null
                    }
                </div>
      </div>
        )
    }
}

export default connect(
    state=>({user:state.user,chats:state.chats}),  
    {sendMsg,updateUnreadCount}
)(Chat)
/*  
    chats = {
        users: {}, 
        chatMsgs: [], 
    }
 */
/*每一条chatMsg包含：
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
*/ 