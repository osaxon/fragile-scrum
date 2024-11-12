import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getNextDueDate } from '@/lib/date-convert'
import { cn } from '@/lib/shadcn'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState } from 'react'
import { Task } from '../schemas/task-schema'
import { TaskDone } from './task-done'

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'done',
    header: 'Done',
    cell: ({ row }) => {
      return <TaskDone task={row.original} />
    }
  },
  {
    accessorKey: 'name',
    header: 'Task',
    cell: ({ row }) => {
      const taskName: string = row.getValue('name')
      const daysRepeat = row.original.daysRepeat

      return (
        <div>
          <p>{taskName}</p>
          <p className='font-light text-muted-foreground'>{`every ${daysRepeat} day${daysRepeat === 1 ? '' : 's'}`}</p>
        </div>
      )
    }
  },
  {
    accessorKey: 'nextDate',
    header: ({ column }) => {
      return (
        <div className='flex w-full justify-end'>
          <Button
            variant='ghost'
            className='gap-x-0 pr-0 text-xs hover:bg-transparent sm:text-sm'
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            Next Date
            <CaretSortIcon />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const nextDate = getNextDueDate(
        row.original.history,
        row.original.daysRepeat
      )

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      nextDate.setHours(0, 0, 0, 0)

      const taskIsLate = today.getTime() >= nextDate.getTime()

      let daysText
      if (nextDate.getTime() === today.getTime()) {
        daysText = 'due today'
      } else {
        // Calculate the difference in days manually to ensure accuracy
        const diffDays = Math.floor(
          (today.getTime() - nextDate.getTime()) / (24 * 60 * 60 * 1000)
        )
        if (diffDays > 0) {
          daysText = `${diffDays} day${diffDays === 1 ? '' : 's'} late`
        } else {
          daysText = `due in ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`
        }
      }

      return (
        <div className='text-right'>
          <p>{format(nextDate, 'EEE dd MMM yyyy')}</p>
          <p
            className={cn(
              'font-light',
              taskIsLate ? 'text-destructive' : 'text-muted-foreground'
            )}>
            {daysText}
          </p>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const dateA = getNextDueDate(
        rowA.original.history,
        rowA.original.daysRepeat
      )
      const dateB = getNextDueDate(
        rowB.original.history,
        rowB.original.daysRepeat
      )
      return dateA.getTime() - dateB.getTime()
    }
  }
]

export function Tasks({ tasks }: { tasks: Task[] }) {
  tasks ??= []
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const navigate = useNavigate()

  const table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      globalFilter: categoryFilter
    },
    globalFilterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === 'All') return true
      return row.original.category === filterValue
    }
  })

  const categories = [
    ...new Set(
      tasks.map((task) => task.category).filter((category) => category)
    )
  ]

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between gap-x-2 py-4'>
        <Input
          placeholder='Filter tasks...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          onKeyDown={(event) =>
            event.key === 'Escape' &&
            table.getColumn('name')?.setFilterValue('')
          }
        />
        <Select
          value={categoryFilter ?? 'All'}
          onValueChange={setCategoryFilter}>
          <SelectTrigger
            className='w-32'
            onKeyDown={(event) =>
              event.key === 'Escape' && setCategoryFilter('All')
            }>
            <SelectValue placeholder='Filter category' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='All'>All</SelectItem>
              {categories.map((category, index) => (
                <SelectItem key={`${category}-${index}`} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className='w-16'
          size='sm'
          onClick={() => navigate({ to: '/tasks/new' })}>
          New
        </Button>
      </div>
      <div className='space-y-4'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='px-2 text-xs sm:text-sm'>
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
                  className='cursor-pointer'
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => navigate({ to: `/tasks/${row.original.id}` })}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='p-2 text-xs sm:text-sm'>
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
