import { apiFetch } from "@/shared/api/client"
import type { MaterialGetResponse } from "../model/types"

export async function getMaterialById(
    materialId: number,
): Promise<MaterialGetResponse> {
    return apiFetch<MaterialGetResponse>(`/materials/${materialId}`, {
        service: "materials",
        method: "GET",
    })
}
