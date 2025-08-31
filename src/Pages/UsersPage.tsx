'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Search, X } from 'lucide-react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  useMaterialReactTable
} from 'material-react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { User, UsersResponse } from '../../types'
import { getUsers, toggleUserStatus } from '../api/users'
import { defaultMeta } from '../lib/columnMeta'

// Filter type
type StatusFilter = '' | 'active' | 'inactive'

// Loading skeleton component
const TableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
)

export default function UsersPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('')
  const [error, setError] = useState<string>('')

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const [data, setData] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch users
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
          pageSize: pagination.pageSize
        })

        if (!cancelled) {
          setData(res?.users ?? [])
          setTotal(res?.totalCount ?? 0)
        }
      } catch (e) {
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
  }, [query, status, pagination.pageIndex, pagination.pageSize])

  // Toggle status with accessibility
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

  // Responsive columns with proper sizing
  const columns = useMemo<MRT_ColumnDef<User>[]>(() => {
    return defaultMeta.map((m) => {
      const baseColumn = {
        header: m.header,
        accessorKey: m.key,
        enableSorting: false,
        minSize: 100 // smaller min size
      }

      if (m.key === 'name') {
        return {
          ...baseColumn,
          size: 180,
          grow: 1
        }
      }

      if (m.key === 'email') {
        return {
          ...baseColumn,
          size: 200, // smaller than before
          minSize: 140,
          grow: 2
        }
      }

      if (m.key === 'groups') {
        return {
          ...baseColumn,
          size: 180,
          enableSorting: false,
          Cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
              {row.original.groups?.length ? (
                row.original.groups.map((g) => (
                  <Badge
                    key={g.id}
                    className="px-2 py-0.5 text-xs rounded-md bg-blue-500/80 text-white"
                  >
                    {g.name} • {g.role}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No groups</span>
              )}
            </div>
          )
        }
      }

      if (m.key === 'status') {
        return {
          ...baseColumn,
          size: 160,
          enableSorting: false,
          Cell: ({ row }) => {
            const active = row.original.status === 'active'
            return (
              <div className="flex items-center gap-2">
                <Badge
                  className={`px-2 py-0.5 rounded-md text-sm ${
                    active
                      ? 'bg-green-500/80 text-white'
                      : 'bg-red-500/80 text-white'
                  }`}
                >
                  {active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  size="sm"
                  variant={active ? 'destructive' : 'secondary'}
                  onClick={() => onToggle(row.original)}
                >
                  {active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            )
          }
        }
      }

      if (m.key === 'createdAt') {
        return {
          ...baseColumn,
          size: 120,
          enableSorting: false,
          Cell: ({ cell }) => {
            const value = cell.getValue<string>()
            if (!value) return <span className="text-muted-foreground">-</span>
            const d = new Date(value)
            return (
              <span className="text-gray-700 text-sm">
                {d.toLocaleDateString()}
              </span>
            )
          }
        }
      }

      return baseColumn
    })
  }, [onToggle])

  const table = useMaterialReactTable<User>({
    columns,
    data: data ?? [],
    state: { isLoading: loading, pagination },
    manualPagination: true,
    rowCount: total ?? 0,
    layoutMode: 'grid', // good for responsive
    enableRowSelection: true,

    defaultColumn: {
      minSize: 80, // allow smaller shrink
      size: 150,
      maxSize: 400
    },

    muiTableContainerProps: {
      sx: {
        maxHeight: '70vh',
        minHeight: '300px',
        overflowX: 'auto' // ✅ enable horizontal scroll when needed
      }
    },

    muiPaginationProps: {
      size: 'small',
      showRowsPerPage: true,
      rowsPerPageOptions: [5, 10, 25, 50]
    },

    onPaginationChange: setPagination
  })

  const clearSearch = () => {
    setQuery('')
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Users Management
          </CardTitle>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search input */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPagination((p) => ({ ...p, pageIndex: 0 }))
                  }}
                  className="pl-10 pr-10 w-full sm:w-64"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Status filter */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as StatusFilter)
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }}
                className="h-10 rounded-md border px-3 py-2 text-sm"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${total} total users`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 sm:px-6">
          {error ? (
            <div className="flex flex-col items-center py-12 text-center">
              <AlertCircle className="w-8 h-8 mb-2 text-destructive" />
              <p className="text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : loading && data.length === 0 ? (
            <div className="px-6">
              <TableSkeleton />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <X className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {query || status
                  ? 'No users match your search criteria'
                  : 'No users found'}
              </p>
              {(query || status) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery('')
                    setStatus('')
                    setPagination((p) => ({ ...p, pageIndex: 0 }))
                  }}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* ✅ No overflow wrapper */}
              <MaterialReactTable table={table} />

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 px-6 text-xs text-muted-foreground">
                <span>
                  Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
                  {Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    total
                  )}{' '}
                  of {total} users
                </span>
                {(query || status) && (
                  <span className="text-blue-600">
                    Filtered {query ? `by "${query}"` : ''}{' '}
                    {status ? `status: ${status}` : ''}
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
