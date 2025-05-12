import { ColumnSort } from '@tanstack/react-table'
import { useBoundStore } from '@/lib/useStoreLocationStore'
import { urls } from '@/config/env-config'

export const fetchStores = async (
  page: number = 0,
  sorting: ColumnSort[] = [],
  location: { lat: number | null; lng: number | null } = {
    lat: null,
    lng: null,
  },
  filters: Record<string, string | number | boolean> = {},
) => {
  try {
    const params = new URLSearchParams({
      page: `${page}`,
      sort: sorting
        .map((sort) => `${sort.id},${sort.desc ? 'desc' : 'asc'}`)
        .join(','),
      userLat: location.lat !== null ? `${location.lat}` : '',
      userLong: location.lng !== null ? `${location.lng}` : '',
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, `${value}`]),
      ),
    })

    const url = `${urls.store}?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    useBoundStore.setState({
      data: data.data,
      total: data.total,
    })

    return data
  } catch (error) {
    console.error('Error fetching stores:', error)

    useBoundStore.setState({
      data: [],
      total: 0,
    })

    return {
      data: [],
      total: 0,
    }
  }
}

export const fetchStatusList = async (): Promise<string[]> => {
  try {
    const response = await fetch(urls.listStatus, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching status list:', error)
    return []
  }
}
