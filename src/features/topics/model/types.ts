export type Topic = {
    id: number
    title: string
    description?: string | null
}

export type PageDto<T> = {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
}
