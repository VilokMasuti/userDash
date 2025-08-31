import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // <- must match MSW
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

export type PaginatedParams = {
  query?: string
  status?: 'active' | 'inactive'
  page?: number
  pageSize?: number
}
