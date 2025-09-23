import axios from 'axios'

const API_URL = 'http://192.168.1.11:3000'

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
})

export default axiosInstance
