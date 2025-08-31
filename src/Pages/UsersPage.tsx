// no "use client" needed for plain React usage
import { UsersTableSkeleton } from '@/components/TableSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
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
type StatusFilter = '' | 'active' | 'inactive'

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
  type SortOption = 'newest' | 'oldest' | 'az' | 'za'
  const [sorting, setSorting] = useState<SortOption>('newest')
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
  }, [query, status, pagination.pageIndex, sorting, pagination.pageSize])

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

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => {
    return defaultMeta.map((m) => {
      const baseColumn = {
        header: m.header,
        accessorKey: m.key,
        enableSorting: false,
        minSize: 100
      }

      if (m.key === 'name') return { ...baseColumn, size: 180, grow: 1 }
      if (m.key === 'email')
        return { ...baseColumn, size: 200, minSize: 140, grow: 2 }

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
                    className="px-2 py-0.5 text-xs rounded-md bg-blue-500 text-white pointer-events-none"
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
          size: 200,
          enableSorting: false,
          Cell: ({ row }) => {
            const active = row.original.status === 'active'
            return (
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    active
                      ? 'px-2 py-0.5 rounded-md text-sm bg-green-600 text-white pointer-events-none'
                      : 'px-2 py-0.5 rounded-md text-sm bg-red-600 text-white pointer-events-none'
                  }
                >
                  {active ? 'Active' : 'Inactive'}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1 transition-colors',
                    active
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'
                  )}
                  onClick={() => onToggle(row.original)}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      active ? 'bg-red-500' : 'bg-green-500'
                    )}
                  />
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
    layoutMode: 'grid',
    enableRowSelection: true,

    defaultColumn: { minSize: 80, size: 150, maxSize: 400 },

    // Flatten look, inherit app background/color
    muiTablePaperProps: {
      sx: {
        backgroundColor: 'transparent',
        color: 'inherit',
        boxShadow: 'none',
        borderRadius: 12
      }
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '70vh',
        minHeight: '300px',
        overflowX: 'auto',
        '& .MuiTableRow-root:hover': { backgroundColor: 'transparent' },
        '& .Mui-TableBodyCell-DetailPanel': { backgroundColor: 'transparent' }
      }
    },
    muiTableBodyRowProps: {
      hover: false,
      sx: { '&:hover': { backgroundColor: 'transparent' }, cursor: 'default' }
    },
    muiTableBodyCellProps: { sx: { borderColor: 'rgba(0,0,0,0.06)' } },
    muiTableHeadRowProps: {
      sx: { '&:hover': { backgroundColor: 'transparent' } }
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: 'transparent',
        color: 'inherit',
        fontWeight: 600,
        borderColor: 'rgba(0,0,0,0.08)'
      }
    },
    muiPaginationProps: {
      size: 'small',
      showRowsPerPage: true,
      rowsPerPageOptions: [5, 10, 25, 50],
      sx: {
        '& .MuiButtonBase-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        },
        '& .MuiButtonBase-root:hover': { backgroundColor: 'transparent' }
      }
    },

    onPaginationChange: setPagination
  })

  const clearSearch = () => {
    setQuery('')
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <Card className="shadow-none">
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
                  className="pl-10 pr-10 w-full sm:w-64 focus-visible:ring-0"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Status filter */}
              <Select
                value={status || 'all'}
                onValueChange={(value: string) => {
                  setStatus(value === 'all' ? '' : (value as StatusFilter)) // "" = no filter
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }}
              >
                <SelectTrigger className="h-10 w-44 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400/30 dark:border-gray-600 dark:bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full animate-pulse duration-1000 bg-green-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full animate-pulse duration-1000  bg-red-500" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort dropdown */}
              <Select
                value={sorting}
                onValueChange={(value: SortOption) => {
                  setSorting(value)
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }}
              >
                <SelectTrigger className="h-10 w-44 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-400/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="az">Name A–Z</SelectItem>
                  <SelectItem value="za">Name Z–A</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2 bg-neutral-800 text-white hover:bg-neutral-800"
              >
                Try Again
              </Button>
            </div>
          ) : loading && data.length === 0 ? (
            <div className="px-6">
              <UsersTableSkeleton />
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
                  size="sm"
                  onClick={() => {
                    setQuery('')
                    setStatus('')
                    setPagination((p) => ({ ...p, pageIndex: 0 }))
                  }}
                  className="mt-2 bg-neutral-800 text-white hover:bg-neutral-800"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
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
                  <span>
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
