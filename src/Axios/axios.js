/* eslint-disable prettier/prettier */
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// const apiBaseUrl = 'http://192.168.1.183:4500/api'
// const apiBaseUrl = 'http://164.52.195.176:4500/api'
// const apiBaseUrl = 'https://97.74.94.118:2224/api'
const apiBaseUrl = 'https://backend-2-rkqo.onrender.com/api'
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  getAll: (entity) => apiClient.get(`/${entity}`),
  getById: (entity, id) => apiClient.get(`/${entity}/${id}`),
  create: (entity, data) => apiClient.post(`/${entity}`, data),
  update: (entity, data) => apiClient.put(`/${entity}`, data),
  delete: (entity, id) => apiClient.delete(`/${entity}/${id}`),
  imageUpload: (data) => apiClient.post('/post', data),
}

//Validation
export const validation = {
  sanitizeInput: (value, setValue) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9.]/g, '')
    if (value !== sanitizedValue) {
      toast.error('Special characters are not allowed')
    }
    setValue(sanitizedValue)
  },
  sanitizeInput1: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^a-zA-Z0-9\s-]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Special characters & Numbers are not allowed')
    }
    setValue1(sanitizeValue)
  },
  sanitizePhone: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^0-9]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Alphabetics and Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  Phonelist: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^0-9,\s xX]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Alphabetics and Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  sanitizeInput2: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^a-zA-Z0-9&\s-]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  sanitizeAddress: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^a-zA-Z0-9/,'.\s-]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  sanitizeDescription: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^a-zA-Z0-9.,\s-]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  sanitizeEmail: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^a-zA-Z0-9@.]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  validateInput: (value) => {
    // Trim leading and trailing spaces and check if there are any consecutive spaces
    const trimmedValue = value.trim()
    const hasConsecutiveSpaces = /\s{2,}/.test(trimmedValue)

    // Valid if trimmedValue has content and no consecutive spaces
    return trimmedValue.length > 0 && !hasConsecutiveSpaces
  },
  Emaillist: (value, setValue1) => {
    const sanitizeValue = value.replace(/[^a-zA-Z0-9,.\s@]/g, '')
    if (value !== sanitizeValue) {
      toast.error('Special characters are not allowed')
    }
    setValue1(sanitizeValue)
  },
  Onlytext: (value, setValue) => {
    const sanitizedValue = value.replace(/[^a-zA-Z /s]/g, '')
    if (value !== sanitizedValue) {
      toast.error('Numbers and Special characters are not allowed')
    }
    setValue(sanitizedValue)
  },
}
