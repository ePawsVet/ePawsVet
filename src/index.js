import React from 'react';
import ReactDOM from 'react-dom';
import App from "./Components/App";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Styles/Style.css"
import 'react-calendar/dist/Calendar.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
