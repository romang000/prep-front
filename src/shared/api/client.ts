import { API_URLS, type ApiServiceName } from './config'

type ApiFetchOptions = RequestInit & {
  service: ApiServiceName
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions,
): Promise<T> {
  const { service, headers, ...restOptions } = options

  const response = await fetch(`${API_URLS[service]}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`)
  }

  return response.json() as Promise<T>
}