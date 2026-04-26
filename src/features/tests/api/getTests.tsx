import { apiFetch } from '@/shared/api/client'
import type { PageDto, TestGetRequest, TestResponse } from '../model/types'

export async function getTests(
  params: TestGetRequest,
): Promise<PageDto<TestResponse>> {
  const searchParams = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  })

  return apiFetch<PageDto<TestResponse>>(`/tests?${searchParams.toString()}`, {
    service: 'tests',
    method: 'GET',
  })
}