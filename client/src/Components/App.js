import React, { useState, useEffect } from "react";
import Main from "./Main";
import jwt_decode from "jwt-decode";

import setAuthToken from './../Utils/setAuthToken'


function App() {

  console.log("app Component Re render")

  return (
    <div className="App">
        <Main/> 
    </div>
  )
}

export default App
