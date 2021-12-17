import { io } from "socket.io-client";
import useAlert from "../Components/toastAlert/useAlert";

import jwt_decode from "jwt-decode";


const URL = "http://localhost:5000";

const { toastAlert } = useAlert();


const socket = io(URL, { autoConnect: false });

socket.on("connect", ()=>{
    
    if (localStorage.jwtToken) {    

        const token = localStorage.jwtToken;
        const decoded = jwt_decode(token);
        socket.emit("USER_ID", decoded["user_id"]);
        toastAlert({msg:"Socket Connected !! ", type:"success"});
    
    }else{

        toastAlert({msg:"Socket Disconnected !! You are offline now", type:"error"})
        socket.disconnect();
    
    }
    
})

socket.on("disconnect", ()=>{
    toastAlert({msg:"Socket Disconnected !! ", type:"error"});
})


export default (socket);
