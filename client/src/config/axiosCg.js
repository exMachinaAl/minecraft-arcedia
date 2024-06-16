// src/config/axiosConfig.js
import axios from 'axios';
//require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env')})

const api = axios.create({
  baseURL: process.env.REACT_APP_API_AXIOS_URL,
});

export default api;
