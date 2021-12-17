import React, {useState} from 'react'
import './../CSS/SignUp.css'
import { Form, Button, FormGroup, Label, Input, Col, Row, Container, Media } from "reactstrap";
import { Link, useHistory } from 'react-router-dom'
import useAlert from './toastAlert/useAlert';
import API from '../Utils/API';
import { observer } from "mobx-react"
import { useStore } from '../Store/RootContext';
import setAuthToken from '../Utils/setAuthToken';
import socket from '../Utils/socket';

function LogIn() {

    console.log("Login Component Re render")


    let history = useHistory();

    // TODO:Reset Password Modal
    // const [resetPasswordModal, setResetPasswordModal] = useState(true);
    // const toggleResetPasswordModal = () => setResetPasswordModal(!resetPasswordModal)

    const { UserState } = useStore();

    const { toastAlert } = useAlert();

    const onLogIn = async (e)=>{
        
        e.preventDefault();
        const {user_id, password} = e.target;

        const response = await API.post("/user/login", { user_id:user_id.value, password:password.value })
        const {errorMsg, user_name, success, token} = response.data;
       
        if(errorMsg){
            toastAlert({ msg: errorMsg, type: "error" })
            return
        } 

        if(success && token){

            setAuthToken(token);
            localStorage.setItem("jwtToken", token);
            
            toastAlert({ msg: "Log In Successfull !!", type: "success" });
            toastAlert({ msg: `Welcome ${user_name}`, type: "info" });

            socket.connect();

            history.push("/home");
        }
 
    }

    const linkStyle = {
        color: "black",
        cursor: "pointer",
        fontWeight: 600,
    }


    return (
            <div>      
                <div  style={{border:"4px solid white", padding:"30px", minWidth:"320px"}}>
                
                    <h2>Log In</h2>
                            
                    <Form onSubmit={onLogIn}>
                        <FormGroup>
                            <Input id="user_id" required type="text" placeholder="Enter your User Name" />
                        </FormGroup>
                        <FormGroup>
                            <Input id="password" required type="password" placeholder="Enter your password" />
                        </FormGroup>
                        <Button style={{padding:"10px", border:"2px solid white", width:"100%", marginTop:"20px", backgroundColor:"white", font:"larger"}} type="submit">
                            Submit
                        </Button>
                    </Form>
                    <span>
                        Want to reset password? &nbsp;
                        <span
                            style={linkStyle}
                            // onClick={toggleResetPasswordModal}
                        >
                            Reset Password
                        </span>
                    </span><br/><br/>
                    <span>
                        If not Sign In ? &nbsp; 
                        <span
                            style={linkStyle}
                        >
                            <Link style={linkStyle} to="/sign-up">Sign Up</Link>
                        </span>
                    </span>
                            
                </div>
            </div>
                        
            
    )   
}

export default LogIn

