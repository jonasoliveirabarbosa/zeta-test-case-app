import { StateCreator } from 'zustand'
import { StoreLocationSlice } from './useStoreLocationStore'
import { ListSlice } from './useListStore'

export type ComponentSlice = {
  open: boolean
  setOpen: (open: boolean) => void
  value: string
  setValue: (value: string) => void
}

export const createComponentSlice: StateCreator<
  ComponentSlice & StoreLocationSlice & ListSlice,
  [],
  [],
  ComponentSlice
> = (set) => ({
  open: false,
  value: '',
  setOpen: (open: boolean) => {
    set(() => ({
      open,
    }))
  },
  setValue: (value: string) => {
    set(() => ({
      value,
    }))
  },
})
