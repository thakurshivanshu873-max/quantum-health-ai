import axios from 'axios'

const BASE = 'http://localhost:8000'

const api = axios.create({ baseURL: BASE, timeout: 30000 })

export const getHealth    = ()              => api.get('/api/health')
export const getDiseases  = ()              => api.get('/api/diseases')
export const getMetrics   = ()              => api.get('/api/metrics')
export const predict      = (data)          => api.post('/api/predict', data)
export const batchPredict = (formData)      => api.post('/api/batch', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000,
})

export default api
