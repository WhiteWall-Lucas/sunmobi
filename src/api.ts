import axios from 'axios'
const baseURL = 'https://app.vindi.com.br/api/v1'
const api = axios.create({
    baseURL,
})

export default api