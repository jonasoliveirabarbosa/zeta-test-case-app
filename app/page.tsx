'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { columns } from './columns'
import { DataTable } from './data-table'
import { Profiler } from 'react'
const queryClient = new QueryClient()

export default function MainPage() {
  return (
    <Profiler
      id="App"
      onRender={(id, phase, actualDuration) => {
        console.log({ id, phase, actualDuration })
      }}
    >
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} />
        </div>
      </QueryClientProvider>
    </Profiler>
  )
}
