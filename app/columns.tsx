'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Check, X, ChevronDown, ChevronUp, Minus } from 'lucide-react'
import { DataTableColumnHeader } from './data-table-column-header'

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
  distance: number | null
  hasClient: boolean
}

const renderClientStatus = (onGoing: boolean, ended: boolean) => {
  if (!onGoing && ended) {
    return (
      <div className="flex items-center">
        <Check className="h-4 w-4 text-green-500" /> Concluído
      </div>
    )
  }
  if (onGoing && !ended) {
    return (
      <div className="flex items-center">
        <Minus className="h-4 w-4 text-yellow-500" /> Em Andamento
      </div>
    )
  }
  return (
    <div className="flex items-center">
      <X className="h-4 w-4 text-red-500" /> Não Visitado
    </div>
  )
}

const renderDistance = (distance: number | null) => {
  if (distance === null) {
    return <span className="text-gray-500">Sem Distância</span>
  }
  return <span>{distance.toFixed(2)} KM</span>
}

export const columns: ColumnDef<Store>[] = [
  {
    accessorKey: 'storeName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Estabelecimento" />
    ),
  },
  {
    accessorKey: 'statusN3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
  },
  {
    id: 'clientStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status do Cliente" />
    ),
    cell: ({ row }) =>
      renderClientStatus(row.original.onGoing, row.original.ended),
  },
  {
    id: 'distance',
    accessorKey: 'distance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Distância" />
    ),
    cell: ({ row }) => (
      <div className="flex">{renderDistance(row.original.distance)}</div>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
          {row.getIsExpanded() ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
    ),
  },
]
