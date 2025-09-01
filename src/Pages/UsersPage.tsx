import type { MRT_PaginationState } from 'material-react-table'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import UsersTable from '@/components/Table/UsersTable'
import type { User, UsersResponse } from '../../types'
import { getUsers, toggleUserStatus } from '../api/users'

type StatusFilter = '' | 'active' | 'inactive'
type SortOption = 'newest' | 'oldest' | 'az' | 'za'

export default function UsersPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('')
  const [error, setError] = useState('')
  const [data, setData] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sorting, setSorting] = useState<SortOption>('newest')
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  useEffect(() => {
    let cancelled = false
    async function fetchUsers() {
      setLoading(true)
      setError('')
      try {
        const res: UsersResponse = await getUsers({
          query,
          status: status || undefined,
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sort: sorting
        })
        if (!cancelled) {
          setData(res?.users ?? [])
          setTotal(res?.totalCount ?? 0)
        }
      } catch {
        if (!cancelled) {
          const errorMsg = 'Failed to load users'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchUsers()
    return () => {
      cancelled = true
    }
  }, [query, status, sorting, pagination.pageIndex, pagination.pageSize])

  const onToggle = useCallback(
    async (user: User) => {
      const prev = [...data]
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      setData((arr) =>
        arr.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      )
      try {
        await toggleUserStatus(user.id)
        toast.success(
          `User ${newStatus === 'active' ? 'activated' : 'deactivated'}`
        )
      } catch {
        setData(prev)
        toast.error('Failed to update status')
      }
    },
    [data]
  )

  return (
    <UsersTable
      data={data}
      total={total}
      error={error}
      loading={loading}
      query={query}
      status={status}
      sorting={sorting}
      pagination={pagination}
      onQueryChange={setQuery}
      onStatusChange={setStatus}
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      onToggle={onToggle}
    />
  )
}
