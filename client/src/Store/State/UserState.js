// import jwt_decode from "jwt-decode";
import { observable, autorun, makeAutoObservable, decorate, toJS } from "mobx";
import API from '../../Utils/API'

import UserService from "../../Services/UserService";

class UserState { 

    // Active User Data
    user_id = ""
    full_name = ""
    user_friends = []
    blocked_friends = []
    // user_friends = [{user_id:"AJ123", full_name:"Aradhya Jain"},{user_id:"SJ123", full_name:"Saumya Jain"}]
    // blocked_friends = ["Aniket Sharma", "Himanshu Kotwal"]

              
    selectedUserId = ""   

    // chatData = [{ chat_id:101, sent_by:"saumya1503", sent_to:"aradhya1907", msg:"Hello How Are You", date:new Date().toUTCString()},
    //         { chat_id:102, sent_by:"saumya1503", sent_to:"saumya1503", msg:"Hello I Am Fine", date:new Date().toUTCString()},
    //         { chat_id:103, sent_by:"aradhya1907", sent_to:"aradhya1907", msg:"Hello How ou", date:new Date().toUTCString()},
    //         { chat_id:104, sent_by:"saumya1503", sent_to:"saumya1503", msg:"Are You", date:new Date().toUTCString()},
    //         { chat_id:105, sent_by:"aradhya1907", sent_to:"aradhya1907", msg:" You", date:new Date().toUTCString()} ]



    
    filter = "" 

    get filtered_friends(){
        const matched_filter = RegExp(this.filter, "i")
        return this.user_friends.filter((friend)=> !this.filter || matched_filter.test(friend.user_id))
    }
    
    
    // Setting up UserData
    async fetchUserData(){
        
        const user = await UserService.getUserData(this.user_id)
        
        this.user_id = user.user_id
        this.full_name = user.full_name
        this.user_friends = user.user_friends
        this.blocked_friends = user.blocked_friends

    }

    resetUserData(){
        this.user_id = ""
        this.full_name = ""
        this.user_friends = []
        this.blocked_friends = []
        this.selectedUserId = "" 
        this.filter = ""
    }

    constructor() {

        makeAutoObservable(this);
        // MobX => Observable, Computed, Action

        // This function runs whenever observable Data Changes
        autorun(()=>{
            console.log("MobX has been run")
        })
    }


}


export default UserState;