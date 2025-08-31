import { db } from '@/mocks/seed'
import { http, HttpResponse, passthrough } from 'msw'
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
    const pageParam = Number(url.searchParams.get('page') ?? '0')
    const pageSizeParam = Number(url.searchParams.get('pageSize') ?? '10')

    const filtered = filterUsers(db.users, query, status)

    // Safe pagination (zero-based)
    const total = filtered.length
    const pageSizeNum = Number(url.searchParams.get('pageSize') ?? '10')
    const pageNum = Number(url.searchParams.get('page') ?? '0')

    const pageSize =
      Number.isFinite(pageSizeNum) && pageSizeNum > 0 ? pageSizeNum : 10
    const maxPageIndex = Math.max(0, Math.ceil(total / pageSize) - 1)
    const page = Math.min(
      Math.max(0, Number.isFinite(pageNum) ? pageNum : 0),
      maxPageIndex
    )

    const start = page * pageSize
    const end = start + pageSize
    const users = filtered.slice(start, end)

    return HttpResponse.json({ totalCount: total, users })
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
  }),

  // Keep LAST: passthrough anything not explicitly mocked
  http.all('*', () => passthrough())
]
