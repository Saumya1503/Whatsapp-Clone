import React, {useState, useEffect} from 'react'
import Chat from "./Chat"
import Sidebar from "./Sidebar"
import './../CSS/Home.css'

import { observer } from "mobx-react";

import jwt_decode from "jwt-decode";
import { useStore } from '../Store/RootContext';
import setAuthToken from './../Utils/setAuthToken'
import socket from '../Utils/socket';

const Home = () => {

  // Whenever user will be directed to /home (Need to access web token and set paylod data to UserState)
  // Fetch User Data (User Friends and all) after getting user_id from payload 
  // if token not set in headers then while sending request to fetch user data server will automatically direct user to login page

  const { UserState } = useStore();


  console.log("Home Component Re render")

  // On Mounting
  useEffect( async ()=>{

    if (localStorage.jwtToken) {
    
      // Set auth token header auth after fetching from localStorage
      const token = localStorage.jwtToken;
      setAuthToken(token);
      
      // Decode token and get user info and exp
      const decoded = jwt_decode(token);
  
      // Set user and isAuthenticated
      UserState.user_id = decoded["user_id"];

      // Fetching User Data
      await UserState.fetchUserData();

      socket.connect();
  
    }


  }, [])


    return (
      <div className="app">
        <div className="app__body">
          <Sidebar />
          <Chat />
        </div>
      </div>
    )

}

export default Home;