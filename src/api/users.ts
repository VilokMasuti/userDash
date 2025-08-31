import type { User, UsersResponse } from '../../types'
import { api, type PaginatedParams } from '../lib/axios'
export async function getUsers(
  params: PaginatedParams
): Promise<UsersResponse> {
  try {
    const res = await api.get<UsersResponse>('/users', { params })
    return res.data
  } catch (err: any) {
    console.error('GET /api/users failed', {
      params,
      msg: err?.message,
      code: err?.code,
      status: err?.response?.status,
      data: err?.response?.data,
      url: '/api/users'
    })
    throw err
  }
}

export async function toggleUserStatus(id: string): Promise<User> {
  try {
    const res = await api.patch<User>(`/users/${id}`)
    return res.data
  } catch (err: any) {
    console.error('PATCH /api/users/:id failed', {
      id,
      msg: err?.message,
      code: err?.code,
      status: err?.response?.status,
      data: err?.response?.data,
      url: `/api/users/${id}`
    })
    throw err
  }
}
