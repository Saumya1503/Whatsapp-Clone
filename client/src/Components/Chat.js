import { Avatar, IconButton } from '@material-ui/core'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SendIcon from '@material-ui/icons/Send';
import React, {useState, useEffect} from 'react'
import { observer } from "mobx-react"
import { useStore } from '../Store/RootContext';
import { v4 as uuid_v4 } from "uuid";
import './../CSS/Chat.css'

import socket from '../Utils/socket';

import UserService from '../Services/UserService';
import { toast } from 'react-toastify';
import useAlert from './toastAlert/useAlert';

const Chat = () => {

    const { UserState } = useStore();

    console.log("Chat Component Re render");
    
    const { toastAlert } = useAlert();

    const [chatMessages, setChatMessages] = useState([])
    
    // TODO: apply search in messages 
    const [chatFilter, setChatFilter] = useState("")


    let userName = "Select Any User from SideBar !! ";

    const [userStatus, setUserStatus] = useState("");

    // Whenever Selected User Id will Change ( Chat Message will be fetched for that partucular user and login user)
    useEffect(async ()=>{

        // fetch the chat messages from UserState.user_id and UserState.selectedUserId 
        if(UserState.selectedUserId!==""){
            const chats = await UserService.getChatData({user_id:UserState.user_id, friend_id:UserState.selectedUserId})
            if(chats!==undefined) setChatMessages(chats);

            const status = await UserService.getUserStatus(UserState.selectedUserId);
            if(status!==undefined) setUserStatus(status);
            else setUserStatus("");
        }


    }, [UserState.selectedUserId])


    if(UserState.selectedUserId!==""){
        const selected_user = UserState.user_friends.filter(friend => friend.user_id === UserState.selectedUserId)
        userName = selected_user[0].full_name;
    }

    // When Chat Data Array Changes i.e. if new mwssage sent or received
    useEffect( ()=>{

        // Filter new messages to save in database
        // If isNew === true => New Messages else oldMessages 
        const newMessages = chatMessages.filter((msg)=>msg.is_new === true);

        chatMessages.forEach((chat)=>chat.is_new = false);    

        if(newMessages.length !== 0){
            UserService.addChatData(newMessages);
        }

        return () => {

            // Filter new messages to save in database
            // If isNew === true => New Messages else oldMessages 
            const newMessages = chatMessages.filter((msg)=>msg.is_new === true);

            chatMessages.forEach((chat)=>chat.is_new = false);    

            if(newMessages.length !== 0){
                UserService.addChatData(newMessages);
            }

        }
    }, [chatMessages])

    // On Message Sent by Login User
    const onMessageSend = (e)=>{
        e.preventDefault();

        const { msg_text } = e.target
        const chat_id = uuid_v4()
        const msgData = msg_text.value;

        const data = {user_id:chat_id, sent_by:UserState.user_id, sent_to:UserState.selectedUserId, msg:msgData, date:new Date().toUTCString(), is_new:true};

        setChatMessages(oldMessages => [...oldMessages, data])

        socket.emit("MESSAGE", {friend_id:UserState.selectedUserId, msgData:data});

        // Clear Value from text box after sending message
        e.target.msg_text.value = "";
    }


    // Apply Socket Listener for receiving message in real time sent by another user from server
    // Add that message to chatMessages array eiyh isNew as true

    useEffect(()=>{
        socket.on("MESSAGE", msgData => {
            toastAlert({msg:"MESSAGE", type:".."})
            msgData.is_new = false;
            if(UserState.selectedUserId === msgData.sent_by){
                setChatMessages(oldMessages => [...oldMessages, msgData]);
            }else{
                // Mark That message is received from this particular user id
            }
        })
    }, [])


    // Also apply condition whwn user is not selected 
    // What to display then

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src="./avatar.png" />
                <div className="chat__info">
                    <h3>{userName}</h3>  
                    <p>{ userStatus==="online"?"online":`Last Seen ${userStatus}` }</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined/>  
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/> 
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">

                {chatMessages.map((data, index)=>{
                    return UserState.user_id===data.sent_by ? (
                        <p key={index} className="chat__message sender_message">
                            {/* <span className="chat__name">{data.sent_by}</span><br/> */}
                            {data.msg}
                            <span className="chat__time">{data.date}</span>
                        </p>
                    )  : (
                        <p key={index} className="chat__message receiver_message">
                            {/* <span className="chat__name">{data.sent_by}</span><br/> */}
                            {data.msg}
                            <span className="chat__time">{data.date}</span>
                        </p>
                    )
                })}

                {/* <p className="chat__message receiver_message">
                    <span className="chat__name">Saumya</span><br/>
                    This is the Message
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>

                <p className="chat__message sender_message">
                    <span className="chat__name">Saumya</span><br/>
                    This is the Message
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p> */}

            </div>
            <div className="chat__bottom">

                <div className="chat__bottomLeft">
                    <IconButton>
                        <EmojiEmotionsIcon/>
                    </IconButton>
                </div>

                <div className="chat__bottomCenter">
                    <form onSubmit={(e)=>{onMessageSend(e)}}>
                        <input
                        className="chat-text-area"
                        id="msg_text"
                        placeholder="Enter message to send"
                        ></input>
                    </form>
                </div>
                
            </div>

        </div>
    )
}

// No Need to make this observable as it is not vhanging any of the UserState, just using it
export default observer(Chat)
