import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/shadcn'
import { RoomSelectModel } from '@/schemas/room.schema'
import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useState } from 'react'

export const columns: ColumnDef<RoomSelectModel>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='gap-x-0 pl-0 text-sm hover:bg-transparent'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Room
          <CaretSortIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const roomName: string = row.getValue('name')
      return (
        <p className='text-muted-foreground text-left text-sm font-light'>
          {roomName}
        </p>
      )
    }
  }
]

export function RoomsTable({ rooms }: { rooms: RoomSelectModel[] }) {
  rooms ??= []
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const navigate = useNavigate()

  const table = useReactTable({
    data: rooms,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection
    },
    globalFilterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === 'All') return true
      return row.original.name === filterValue
    }
  })

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Filter rooms...'
          className='rounded-r-none focus-visible:ring-0'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          onKeyDown={(event) =>
            event.key === 'Escape' &&
            table.getColumn('name')?.setFilterValue('')
          }
        />
        <Button
          className='ml-2 size-10 rounded-full'
          aria-label='Add new task'
          onClick={() => navigate({ to: '/rooms/new' })}>
          <PlusIcon className='scale-125' />
        </Button>
      </div>
      <div className='space-y-4'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='border-none hover:bg-inherit'>
                {headerGroup.headers.map((header, columnIndex) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'px-2',
                        columnIndex === 0 ? 'w-9' : 'w-fit'
                      )}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='hover:bg-popover/50 cursor-pointer border-none'
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => navigate({ to: `/rooms/${row.original.id}` })}>
                  {row.getVisibleCells().map((cell, index, array) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'px-2 py-1',
                        index === 0 && 'rounded-l-md',
                        index === array.length - 1 && 'rounded-r-md'
                      )}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-8 text-center'>
                  {rooms.length ? 'No results.' : 'No rooms added yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
