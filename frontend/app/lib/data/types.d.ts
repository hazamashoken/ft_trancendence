export type IGetDataInit = {
  cache?: RequestCache;
  queryParams?:
  | string
  | string[][]
  | Record<string, any>
  | URLSearchParams
  | undefined;
  options?: RequestInit;
} 