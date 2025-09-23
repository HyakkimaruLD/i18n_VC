import axiosInstance from './axiosInstance'

export const registerUser = (user) => axiosInstance.post('/auth/register', user)
export const loginUser = (credentials) => axiosInstance.post('/auth/login', credentials)
