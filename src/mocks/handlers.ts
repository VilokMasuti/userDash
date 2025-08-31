import { db } from '@/mocks/seed'
import { http, HttpResponse } from 'msw'
import type { User } from '../../types'

function filterUsers(
  all: User[],
  query?: string,
  status?: 'active' | 'inactive' | ''
) {
  let list = all
  if (query && query?.trim()) {
    const q = query.trim().toLowerCase()
    list = list.filter((user) => user.name.toLowerCase().includes(q))
  }
  if (status === 'active' || status === 'inactive') {
    list = list.filter((u) => u.status === status)
  }
  return list
}

export const handlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') ?? ''
    const status = (url.searchParams.get('status') ?? '') as
      | ''
      | 'active'
      | 'inactive'
    const page = Number(url.searchParams.get('page') ?? '0')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const filtered = filterUsers(db.users, query, status)

    // Simple  pagination
    const start = page * pageSize
    const end = start + pageSize
    const pageItems = filtered.slice(start, end)

    return HttpResponse.json({ totalCount: filtered.length, users: pageItems })
  }),

  http.patch('/api/users/:id', async ({ params }) => {
    const id = params.id as string
    const idx = db.users.findIndex((u) => u.id === id)
    if (idx === -1) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    const current = db.users[idx]
    const next: User = {
      ...current,
      status: current.status === 'active' ? 'inactive' : 'active'
    }
    db.users[idx] = next
    return HttpResponse.json(next)
  })
]
