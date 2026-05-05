export const API_URLS = {
  auth: 'http://localhost:8083',
  tests: 'http://localhost:8080',
  materials: 'http://localhost:8081',
  recommendations: 'http://localhost:8082',
} as const

export type ApiServiceName = keyof typeof API_URLS
