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
import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons'
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
    header: () => <p className='pl-1'>Done</p>,
    cell: ({ row }) => {
      return <TaskDone task={row.original} />
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='gap-x-0 pl-0 text-xs hover:bg-transparent sm:text-sm'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Task
          <CaretSortIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const taskName: string = row.getValue('name')
      const daysRepeat = row.original.daysRepeat

      return (
        <div>
          <p className='text-left text-sm font-light text-muted-foreground'>
            {taskName}
          </p>
          <p className='text-xs'>{`every ${daysRepeat} day${daysRepeat === 1 ? '' : 's'}`}</p>
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
          <p className='hidden text-sm font-light text-muted-foreground sm:block'>
            {format(nextDate, 'iii dd MMM yyyy')}
          </p>
          <p className='text-sm font-light text-muted-foreground sm:hidden'>
            {format(nextDate, 'dd MMM yyyy')}
          </p>
          <p className={cn('text-xs', taskIsLate ? 'text-destructive' : '')}>
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

export function TasksTable({ tasks }: { tasks: Task[] }) {
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
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Filter tasks...'
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
        <Select
          value={categoryFilter ?? 'All'}
          onValueChange={setCategoryFilter}>
          <SelectTrigger
            className='w-32 rounded-l-none border-l-0 focus:ring-0 focus-visible:ring-0'
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
          className='ml-2 size-9 rounded-lg'
          size='sm'
          onClick={() => navigate({ to: '/tasks/new' })}>
          <PlusIcon />
        </Button>
      </div>
      <div className='space-y-4'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-none'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='px-0'>
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
                  className='cursor-pointer border-none'
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => navigate({ to: `/tasks/${row.original.id}` })}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-0 py-1'>
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
                  {tasks.length ? 'No results.' : 'No tasks added yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
