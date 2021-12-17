import React from 'react'
import './../CSS/Sidebar.css'
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import {Avatar, IconButton} from '@material-ui/core';
import SidebarChat from './SidebarChat';
import { observer } from "mobx-react"
import { useStore } from '../Store/RootContext';
import useAlert from './toastAlert/useAlert';
import { useHistory } from 'react-router-dom'
import setAuthToken from '../Utils/setAuthToken';

import socket from '../Utils/socket';
import UserService from '../Services/UserService';

const Sidebar = () => {

    console.log("Sidebar Component Re render")

    const { toastAlert } = useAlert();

    let history = useHistory();

    const { UserState } = useStore();

    const addFriend = async (e) => {
        e.preventDefault();
        const {user_id} = e.target;
        
        // Checking if Friend Already in Friend List
        let flag = false
        UserState.user_friends.forEach((friends)=>{
            if(user_id.value === friends.user_id){
                toastAlert({msg:`${friends.full_name} Already a Friend`, type:"info"});
                flag = true;
            }
        })

        // If Friend id is same as login id
        if(user_id.value === UserState.user_id){
            toastAlert({msg:`Error !! `, type:"error"});
            flag = true;
        }
        
        if(flag===true) return;

        const friend_data = await UserService.addFriend(UserState.user_id, user_id.value);
        if(friend_data !== undefined) UserState.user_friends.push(friend_data);

    }

    const changeFilter = (e) => { 
        UserState.filter = e.target.value 
    }

    const LogOut = ()=>{
        toastAlert({msg:"Logging Out ......", type:"warn"})
        setAuthToken(false);
        UserState.resetUserData();
        localStorage.removeItem("jwtToken");
        socket.disconnect();
        history.push("/log-in");
    }
    
    return (

        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src="icon.jpg"/>
                <h3 id="userName">{UserState.full_name}</h3>
                <div className="sidebar__headerRight">
                    <IconButton onClick={LogOut}>
                        <DonutLargeIcon/>   
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/> 
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                
                <form onSubmit={(e)=>{addFriend(e)}} className="sidebar__searchContainer"> 
                    <SearchOutlined/>
                    <input id="user_id" type="text" placeholder="Add Friend with User Id" onChange={(e)=>{changeFilter(e)}} />
                </form>
            </div>

            <div className="sidebar__chats" >
                {UserState.filtered_friends.map((friend)=>{
                    return <SidebarChat key={friend.user_id} user_id={friend.user_id} full_name={friend.full_name}/> 
                })}
            </div>

        </div>
    )
}

export default observer(Sidebar)
