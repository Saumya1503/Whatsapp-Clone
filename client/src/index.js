import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/index.css';
import App from './Components/App';
import StoreProvider from './Store/StoreProvider'

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
        <App />
    </StoreProvider>
  </React.StrictMode>,
   
  document.getElementById('root')
);

