import axiosInstance from './axiosInstance'

export const getViolations = () => axiosInstance.get('/violations')
export const getViolationById = (id) => axiosInstance.get(`/violations/${id}`)
export const createViolation = (violation) => axiosInstance.post('/violations', violation)
export const getViolationsByDate = (date) => axiosInstance.get(`/violations/date/${date}`)
