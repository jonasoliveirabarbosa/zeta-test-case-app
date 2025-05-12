import { StoreLocationSlice } from './useStoreLocationStore'
import { StateCreator } from 'zustand'
import {
  ExpandedState,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { ComponentSlice } from './usePopoverStore'

type ColumnVisibility = {
  [key: string]: boolean
}

export type ListSlice = {
  filters: {
    [key: string]: string | number | boolean
  }
  total: number
  pagination: PaginationState
  sorting: SortingState
  setFilter: (filters: { [key: string]: string | number | boolean }) => void
  setPagination: (
    pagination: PaginationState | Updater<PaginationState>,
  ) => void
  setSorting: (sorting: SortingState | Updater<SortingState>) => void
  columnVisibility: ColumnVisibility
  setColumnVisibility: (
    columnVisibility: ColumnVisibility | Updater<ColumnVisibility>,
  ) => void
  expanded: ExpandedState
  setExpanded: (expanded: ExpandedState | Updater<ExpandedState>) => void
}

export const createListSlice: StateCreator<
  StoreLocationSlice & ListSlice & ComponentSlice,
  [],
  [],
  ListSlice
> = (set, get) => ({
  total: 0,
  pagination: {
    pageIndex: 0,
    pageSize: 30,
  },
  columnVisibility: {
    storeName: true,
    status: true,
    actions: true,
    ended: true,
    onGoing: true,
    hasClient: true,
    distance: false,
  },
  sorting: [
    {
      id: 'storeName',
      desc: false,
    },
  ],
  filters: {},
  expanded: {},
  setFilter: (filters: { [key: string]: string | number | boolean }) => {
    set((store) => ({
      filters: {
        ...store.filters,
        ...filters,
      },
    }))
  },
  setColumnVisibility: (
    newColumnVisibility: ColumnVisibility | Updater<ColumnVisibility>,
  ) => {
    set((state) => ({
      columnVisibility:
        typeof newColumnVisibility === 'function'
          ? newColumnVisibility(state.columnVisibility)
          : newColumnVisibility,
    }))
  },
  setUserLocation: (lat: number, lng: number) => {
    set(() => ({
      userLocation: {
        lat,
        lng,
      },
    }))
    set(() => ({
      columnVisibility: {
        ...get().columnVisibility,
        distance: true,
      },
    }))
    set(() => ({
      sorting: [
        {
          id: 'distance',
          desc: false,
        },
      ],
    }))
  },
  setPagination: (
    newPagination: PaginationState | Updater<PaginationState>,
  ) => {
    set((state) => ({
      pagination:
        typeof newPagination === 'function'
          ? newPagination(state.pagination)
          : newPagination,
      expanded: {},
    }))
  },
  setSorting: (newSorting: SortingState | Updater<SortingState>) => {
    set((state) => ({
      sorting:
        typeof newSorting === 'function'
          ? newSorting(state.sorting)
          : newSorting,
      pagination: {
        ...state.pagination,
        pageIndex: 0,
      },
    }))
  },
  setExpanded: (newExpanded: ExpandedState | Updater<ExpandedState>) => {
    set((state) => ({
      expanded:
        typeof newExpanded === 'function'
          ? newExpanded(state.expanded)
          : newExpanded,
    }))
  },
})
