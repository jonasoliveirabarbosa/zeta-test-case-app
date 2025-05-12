'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBoundStore } from '@/lib/useStoreLocationStore'
import { Store } from './columns'
import { DataTablePagination } from './pagination'
import React, { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import ImageWithFallback from '@/components/custom/image-with-fallback'
import { fetchStatusList, fetchStores } from '@/lib/fetchQuery'

interface DataTableProps {
  columns: ColumnDef<Store>[]
}

export function DataTable({ columns }: DataTableProps) {
  const {
    pagination,
    sorting,
    userLocation,
    filters,
    columnVisibility,
    expanded,
    statusList,
    open,
    value,
    setUserLocation,
    setFilter,
    setPagination,
    setSorting,
    setColumnVisibility,
    setExpanded,
    setOpen,
    setValue,
  } = useBoundStore()

  const filterUpdateSubject = new Subject<{
    [key: string]: string | number | boolean
  }>()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          if (
            lat &&
            lng &&
            (userLocation.lat !== lat || userLocation.lng !== lng)
          ) {
            setUserLocation(lat, lng)
          }
        },
        (error) => {
          console.error('Error getting user location:', error)
        },
      )
    }

    const subscription = filterUpdateSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((setFilters) => {
        setFilter(setFilters)
      })

    return () => {
      subscription.unsubscribe()
    }
  })

  const filterUpdate = (filters: {
    [key: string]: string | number | boolean
  }) => {
    console.log('filterUpdate', filters)
    setFilter(filters)
  }

  const dataQuery = useQuery({
    queryKey: ['stores', pagination.pageIndex, sorting, userLocation, filters],
    queryFn: () =>
      fetchStores(pagination.pageIndex, sorting, userLocation, filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const statusListQuery = useQuery({
    queryKey: ['statusList', statusList],
    queryFn: () => fetchStatusList(),
    placeholderData: keepPreviousData,
  })

  const table = useReactTable({
    columns,
    data: dataQuery.data?.data ?? [],
    rowCount: dataQuery.data?.total ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    getRowCanExpand: () => true,
    state: {
      pagination: pagination,
      expanded,
      sorting,
      columnVisibility,
    },
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
  })

  return (
    <div className="rounded-md border">
      <div className="itens-stretch my-4 flex w-[90%] place-content-between items-center place-self-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="basis-1/2">
            <Button
              variant="outline"
              role="combobox"
              className="justify-between"
            >
              {value ? value : 'Selecionar Status...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput placeholder="Filtrar Status..." className="h-9" />
              <CommandList>
                <CommandEmpty>Status não encontrado</CommandEmpty>
                <CommandGroup>
                  {statusListQuery.data?.map((status: string) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={(currentValue) => {
                        filterUpdate({
                          statusN3: currentValue === value ? '' : currentValue,
                        })
                        setValue(currentValue === value ? '' : currentValue)
                        setOpen(false)
                      }}
                    >
                      {status}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === status ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          className="ml-1 flex-1"
          placeholder="Filtrar por endereço..."
          onChange={(event) => {
            filterUpdateSubject.next({ address: event.target.value })
          }}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length - 1} className="h-24">
                      <div className="flex">
                        <div className="flex basis-1/2 gap-2">
                          <ImageWithFallback
                            src={
                              row.original.imgUrl?.trim().length === 0
                                ? '/image-not-found.png'
                                : row.original.imgUrl.trim()
                            }
                            alt={row.original.storeName ?? null}
                            height={200}
                            width={200}
                            className="flex-1 rounded-md"
                          />
                          <div className="flex flex-col gap-2 text-wrap">
                            <h3 className="text-lg font-semibold">
                              {row.original.storeName}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge>{row.original.status}</Badge>
                              <Badge>{row.original.statusN2}</Badge>
                              <Badge>{row.original.statusN3}</Badge>
                              <Badge>{row.original.statusN4}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex basis-1/2">
                          <p className="text-wrap">
                            <span className="text-base font-semibold">
                              Endereço:{' '}
                            </span>
                            <span className="text-sm">
                              {row.original.address}
                            </span>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  )
}
