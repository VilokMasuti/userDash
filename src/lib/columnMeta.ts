export type ColumnMeta =
  | {
      key: 'name' | 'email'
      header: string
      type: 'string'
      width?: number
      sorting?: boolean
      pinned?: 'left' | 'right'
    }
  | {
      key: 'status'
      header: string
      type: 'badge'
      width?: number
    }
  | {
      key: 'createdAt'
      header: string
      type: 'date'
      format?: 'YYYY-MM-DD'
      width?: number
    }
  | {
      key: 'groups'
      header: string
      type: 'chiplist'
      width?: number
    }

export const defaultMeta: ColumnMeta[] = [
  {
    key: 'name',
    header: 'Name',
    type: 'string',
    width: 220,
    sorting: true,
    pinned: 'left'
  },
  { key: 'email', header: 'Email', type: 'string', width: 260, sorting: true },
  { key: 'status', header: 'Status', type: 'badge', width: 120 },
  {
    key: 'createdAt',
    header: 'Joined',
    type: 'date',
    format: 'YYYY-MM-DD',
    width: 140
  },
  { key: 'groups', header: 'Groups', type: 'chiplist', width: 280 }
]
