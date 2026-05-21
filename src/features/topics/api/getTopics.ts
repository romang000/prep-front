import { apiFetch } from "@/shared/api/client"
import type { PageDto, Topic } from "../model/types"

export function getTopics() {
    const searchParams = new URLSearchParams({
        pageNumber: "0",
        pageSize: "1000",
    })

    return apiFetch<PageDto<Topic>>(`/topics?${searchParams.toString()}`, {
        service: "tests",
        method: "GET",
    })
}
