import { apiFetch } from "@/shared/api/client";
import type { PageDto, MaterialGetRequest, MaterialGetResponse } from "../model/types";

export async function getMaterials(
    params: MaterialGetRequest,
): Promise<PageDto<MaterialGetResponse>> {
    const searchParams = new URLSearchParams({
        userId: String(params.userId),
        topicId: String(params.topicId),
        pageNumber: String(params.pageNumber),
        pageSize: String(params.pageSize),
    });

    if (params.level) {
        searchParams.set("level", params.level);
    }

    if (params.subtopic) {
        searchParams.set("subtopic", params.subtopic);
    }

    return apiFetch<PageDto<MaterialGetResponse>>(
        `/materials?${searchParams.toString()}`,
        {
            service: "materials",
            method: "GET",
        },
    );
}
