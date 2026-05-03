export const API_URLS = {
  tests: 'http://localhost:8080',
  materials: 'http://localhost:8081',
  recommendations: 'http://localhost:8082',
} as const

export type ApiServiceName = keyof typeof API_URLS