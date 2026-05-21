import { apiFetch } from "@/shared/api/client";
import type { PageDto, MaterialGetTopicsRequest, MaterialTopicGetResponse } from "../model/types";

export async function getMaterialsTopics(
    params: MaterialGetTopicsRequest,
): Promise<PageDto<MaterialTopicGetResponse>> {
    const searchParams = new URLSearchParams({
        userId: String(params.userId),
        pageNumber: String(params.pageNumber),
        pageSize: String(params.pageSize),
    });

    if (params.level) {
        searchParams.set("level", params.level);
    }

    if (params.learningTrackId) {
        searchParams.set("learningTrackId", String(params.learningTrackId));
    }

    return apiFetch<PageDto<MaterialTopicGetResponse>>(
        `/materials/topics?${searchParams.toString()}`,
        {
            service: "materials",
            method: "GET",
        },
    );
}
