import React from "react";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function useAlert() {

    toast.configure()
    
    const toastAlert = ({
        msg,
        type
    }) => {

        if(type==="success"){
            toast.success(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme:"colored"
                });
        }else if(type==="error"){
            toast.error(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme:"colored"
                });
        }else if(type==="info"){
            toast.info(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme:"colored"
                });
        }else{
            toast(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme:"colored"
                });
        }
    };

    return { toastAlert };
}
export default useAlert;
