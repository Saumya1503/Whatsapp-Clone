import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast() {
    const notify = () => toast.warn('🦄 Wow so easy!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    return (
      <div>
        <button onClick={notify}>Notify!</button>
        {/* <ToastContainer /> */}
      </div>
    );
}

export default Toast
