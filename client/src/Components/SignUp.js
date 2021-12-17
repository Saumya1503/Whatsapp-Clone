import React, {useState} from 'react'
import './../CSS/SignUp.css'
import { Form, Button, FormGroup, Label, Input, Col, Row, Container, Media } from "reactstrap";
import { Link, useHistory } from 'react-router-dom'
import useAlert from './toastAlert/useAlert';
import API from '../Utils/API';

function SignUp() {

    let history = useHistory();

    const { toastAlert } = useAlert();

    let selectedFile = "";

    const onSignUp = async (e)=>{
        
        e.preventDefault();
        const {user_name, full_name, password} = e.target;

        // Checking if User Id already exist in db
        const response = await API.post("/user/countUserId", { user_id:user_name.value })
        const {errorMsg, count} = response.data;

        if(errorMsg) {
            toastAlert({ msg: "Sign Up Failed !!", type: "error" })
            return
        }

        if(count>0){
            toastAlert({ msg: "User Id Already Exist !!", type: "error" })
            return
        }
        
        const response1 = await API.post("/user/signUpUser", {
            user_id:user_name.value,
            full_name:full_name.value,
            password: password.value
        })

        const {errorMsg1, user} = response1.data;
        
        
        // if(errorMsg1) {
        //     toastAlert({ msg: "Sign Up Failed !!", type: "error" })
        // }else{

        //     let formData = new FormData();    //formdata object

        //     formData.append('user_id', user_name.value);   //append the values with key, value pair
        //     formData.append('image', selectedFile);

        //     await API.post("/user/upload/dp", formData);

        //     toastAlert({ msg: "Sign Up Successfull !!", type: "success" });
        //     history.push("/log-in")
        // }

        if(errorMsg1) {
            toastAlert({ msg: "Sign Up Failed !!", type: "error" })
            return;
        }
        
        toastAlert({ msg: "Sign Up Successfull !!", type: "success" });
        history.push("/log-in")
    }

    // TODO:Image not selecting
    const onImageSelect = (event) => {
        console.log(event.target.files[0])
        console.log(typeof(event.target.files[0]))
        console.log(typeof(selectedFile))
        selectedFile = event.target.files[0];
        console.log(typeof(selectedFile))
        console.log(selectedFile)
        console.log(typeof(selectedFile))
    }

    const linkStyle = {
        color: "black",
        cursor: "pointer",
        fontWeight: 600,
    }

    return (

        <div style={{border:"4px solid white", padding:"30px", minWidth:"320px"}}>
                    <h2>Sign Up</h2>
                            
                    <Form onSubmit={onSignUp}>
                        <FormGroup>
                            <Input id="full_name" required type="text" placeholder="Enter your Full Name" />
                        </FormGroup>
                        <FormGroup>
                            <Input id="user_name" required type="text" placeholder="Enter your User Name" />
                        </FormGroup>
                        <FormGroup>
                            <Input id="password" required type="password" placeholder="Enter your password" />
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <Label for="image"><h3>Upload Profile Picture</h3></Label>
                            <Input type="file" id="image" name="image" accept=".pdf,.png,.jpeg,.jpg" onChange={(event)=>{onImageSelect(event)}} />
                        </FormGroup>
                        <Button style={{padding:"10px", border:"2px solid white", width:"100%", marginTop:"20px", backgroundColor:"white", font:"larger"}} type="submit">
                            Submit
                        </Button>
                    </Form>
                    <span>
                        Already Log In? &nbsp;
                        <span
                            style={linkStyle}
                            // onClick={() => onClickReset()}
                        >
                            <Link style={linkStyle} to="/log-in">Log In</Link>
                        </span>
                    </span>
                            
                </div>

                        
            
    )   
}

export default SignUp

