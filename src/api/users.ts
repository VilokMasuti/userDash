import type { User, UsersResponse } from '../../types'
import { api, type PaginatedParams } from '../lib/axios'

export async function fetchUsers(
  params: PaginatedParams
): Promise<UsersResponse> {
  const res = await api.get<UsersResponse>('/api/users', { params })
  return res.data
}
export async function toggleUserStatus(id: string): Promise<User> {
  const res = await api.patch<User>(`/api/users/${id}`)
  return res.data
}
