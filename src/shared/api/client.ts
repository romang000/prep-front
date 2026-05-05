import { API_URLS, type ApiServiceName } from './config'
import { refreshTokens } from '@/features/auth/api/refresh'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '@/features/auth/model/tokenStorage'

type ApiFetchOptions = RequestInit & {
  service: ApiServiceName
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions,
): Promise<T> {
  return requestWithAuth<T>(path, options, true)
}

async function requestWithAuth<T>(
  path: string,
  options: ApiFetchOptions,
  canRefresh: boolean,
): Promise<T> {
  const { service, headers, ...restOptions } = options
  const accessToken = getAccessToken()

  const response = await fetch(`${API_URLS[service]}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  })

  if (response.status === 401 && canRefresh) {
    const refreshToken = getRefreshToken()

    if (refreshToken) {
      try {
        const tokens = await refreshTokens(refreshToken)

        setAuthTokens(tokens)

        return requestWithAuth<T>(path, options, false)
      } catch {
        clearAuthTokens()
      }
    }
  }

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
