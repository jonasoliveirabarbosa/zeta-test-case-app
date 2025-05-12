import { create, StateCreator } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { createListSlice, ListSlice } from './useListStore'
import { ComponentSlice, createComponentSlice } from './usePopoverStore'

export type Store = {
  id: string
  storeName: string
  address: string
  status: string
  statusN2: string
  statusN3: string
  statusN4: string
  imgUrl: string
  lat: number
  lng: number
  onGoing: boolean
  ended: boolean
  tags: {
    rotulo: string
    cor_fundo: string
    cor_texto: string
    tag_primaria: string
  }
  hasClient: boolean
}

export type StoreLocationSlice = {
  data: Store[]
  userLocation: {
    lat: number | null
    lng: number | null
  }
  statusList: string[]
  setStatusList: (statusList: string[]) => void
  setUserLocation: (lat: number, lng: number) => void
}

export const createStoreLocationSlice: StateCreator<
  StoreLocationSlice & ListSlice & ComponentSlice,
  [],
  [],
  StoreLocationSlice
> = (set, get) => ({
  data: [],
  userLocation: {
    lat: null,
    lng: null,
  },
  statusList: ['Tradicional'],
  setStatusList: (statusList: string[]) => {
    set(() => ({
      statusList,
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
})

export const useBoundStore = create<
  StoreLocationSlice & ListSlice & ComponentSlice
>()(
  subscribeWithSelector((...a) => ({
    ...createListSlice(...a),
    ...createStoreLocationSlice(...a),
    ...createComponentSlice(...a),
  })),
)
