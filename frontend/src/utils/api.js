import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mf_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const apisApi = {
  list: () => api.get('/apis'),
  create: (data) => api.post('/apis', data),
  get: (id) => api.get('/apis/' + id),
  update: (id, data) => api.patch('/apis/' + id, data),
  delete: (id) => api.delete('/apis/' + id),
}

export const keysApi = {
  list: (apiId) => api.get('/apis/' + apiId + '/keys'),
  create: (apiId, data) => api.post('/apis/' + apiId + '/keys', data),
  revoke: (apiId, keyId) => api.delete('/apis/' + apiId + '/keys/' + keyId),
}

export const usageApi = {
  stats: () => api.get('/usage/stats'),
}

export const billingApi = {
  summary: () => api.get('/billing/summary'),
  invoices: () => api.get('/billing/invoices'),
  generateInvoice: () => api.post('/billing/invoices/generate'),
}

export default api