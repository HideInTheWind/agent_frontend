import { useCallback, useState } from 'react'

interface UseTableOptions<T> {
  fetcher: (params: { page: number; pageSize: number }) => Promise<{
    list: T[]
    total: number
  }>
  defaultPageSize?: number
}

export function useTable<T>({ fetcher, defaultPageSize = 10 }: UseTableOptions<T>) {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const loadData = useCallback(
    async (nextPage: number, nextPageSize: number) => {
      setLoading(true)
      try {
        const result = await fetcher({ page: nextPage, pageSize: nextPageSize })
        setDataSource(result.list)
        setTotal(result.total)
        setPage(nextPage)
        setPageSize(nextPageSize)
      } finally {
        setLoading(false)
      }
    },
    [fetcher],
  )

  const onPageChange = useCallback(
    (nextPage: number, nextPageSize: number) => {
      void loadData(nextPage, nextPageSize)
    },
    [loadData],
  )

  return {
    loading,
    dataSource,
    total,
    page,
    pageSize,
    loadData,
    onPageChange,
    pagination: {
      current: page,
      pageSize,
      total,
      showSizeChanger: true,
      onChange: onPageChange,
    },
  }
}
