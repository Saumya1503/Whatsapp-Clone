import { Avatar } from '@material-ui/core'
import React from 'react'
import './../CSS/SidebarChat.css'
import { observer } from "mobx-react"
import { useStore } from '../Store/RootContext';
import socket from '../Utils/socket';

function SidebarChat({user_id, full_name}) {

    console.log("Sidebar Chat Component Re render")


    const { UserState } = useStore();

    const setSelectedUser = (e)=>{
        UserState.selectedUserId = user_id;

        // User Id will work as an socket Id
        socket.emit("JOIN", user_id);
    }

    return (
        <div onClick={setSelectedUser} className="sidebarChat">
            <Avatar src="avatar.png"/>
            <div className="sidebarChat__info">
                {full_name}<b> UID:</b>{user_id}
            </div>
            {/* Button for blocking User */}
            {/* <button className="block_user"></button>             */}
        </div>
    )   
}

export default observer(SidebarChat)
