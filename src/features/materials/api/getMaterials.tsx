import { apiFetch } from "@/shared/api/client";
import type { PageDto, MaterialGetRequest, MaterialGetResponse } from "../model/types";

export async function getMaterials(
    params: MaterialGetRequest,
): Promise<PageDto<MaterialGetResponse>> {
    const searchParams = new URLSearchParams({
        userId: String(params.userId),
        pageNumber: String(params.pageNumber),
        pageSize: String(params.pageSize),
    });

    if (params.level) {
        searchParams.set("level", params.level);
    }

    return apiFetch<PageDto<MaterialGetResponse>>(
        `/materials?${searchParams.toString()}`,
        {
            service: "materials",
            method: "GET",
        },
    );
}