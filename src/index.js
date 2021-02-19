import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
//import './index.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { createBrowserHistory } from "history";

import App from "./App";
const axios = require("axios");

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
//const history = createBrowserHistory();
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 404 && originalRequest.url === "/token") {
      return (window.location.href = "/");
    }
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      return axios
        .post("/token", {
          token: refreshToken,
        })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            console.log("Radi se refresh tokena:" + localStorage.getItem("token"));
            axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);
ReactDOM.render(
    <App />,
  document.getElementById("root")
);
