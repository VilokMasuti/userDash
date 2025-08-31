export type Group = {
  id: string
  name: string
  role: 'admin' | 'manager' | 'member'
}
export type User = {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  createdAt: string // ISO
  groups: Group[]
}

export type UsersResponse = {
  totalCount: number
  users: User[]
  status?: 'active' | 'inactive'
}
