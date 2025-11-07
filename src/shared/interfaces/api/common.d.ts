export type ISODateString = string

export type EntityRef<T> = string | T

export type PaginatedResponse<TItem, K extends string = 'items'> = {
  count: number
} & { [P in K]: TItem[] }
