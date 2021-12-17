import axios from "axios";
import useAlert from "../Components/toastAlert/useAlert";
import API from '../Utils/API'

const { toastAlert } = useAlert();

class UserService{

    async getUserData(user_id){
        const response = await API.post("/user/getUserData", {user_id:user_id})
        console.log("response.data", response.data)
        const {errorMsg, user} = response.data
        console.log("User Hoo Main", user)
        return user
    }

    async addFriend(user_id, friend_id){
        try{
            const response = await API.post("/user/addFriend", {user_id:user_id, friend_id:friend_id})
            const {errorMsg, success, friend_data} = response.data;
            if(errorMsg){
                toastAlert({msg:errorMsg, type:"error"});
            }else{
                toastAlert({msg:success, type:"success"});
                return friend_data;
            }
        }catch(err){
            toastAlert({msg:"Error in Adding Friend !!", type:"error"})
        }
    }

    async getChatData({user_id, friend_id}){
        try{
            const response = await API.post("/user/getChatData", {user_id, friend_id})
            const {errorMsg, chats} = response.data;
            if(errorMsg){
                toastAlert({msg:errorMsg, type:"error"})
            }else{
                return chats
            }
        }catch(err){
            toastAlert({msg:"Error in fetching Chat Data !!", type:"error"})
        }
    }

    async addChatData(chatArray){
        try{
            const response = await API.post("/user/addChatData", {chats:chatArray})
            const {errorMsg, success} = response.data;
            if(errorMsg){
                toastAlert({msg:errorMsg, type:"error"})
            }
        }catch(err){
            toastAlert({msg:"Error in saving Chat Data !!", type:"error"})
        }
    }
    
    async getUserStatus(user_id){
        try{

            const response = await API.post("/user/status", {user_id})
            const {errorMsg, status} = response.data;

            if(!errorMsg && status!==null){
                return status;
            }else{
                toastAlert({msg:errorMsg, type:"error"});
            }

        }catch(err){
            toastAlert({msg:"Error in Fetching User Status !!", type:"error"})
        }
    }

}

export default new UserService();
