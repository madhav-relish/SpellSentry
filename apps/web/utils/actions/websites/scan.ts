import { ServerActionResponse } from "@/lib/types/actions";

export async function scanWebsiteAction(
  websiteId: string
): Promise<ServerActionResponse> {
  try {
    const response = await fetch(`/api/websites/${websiteId}/scan`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to scan website" };
    }

    return { data: data.data };
  } catch (error) {
    return { error: "Failed to scan website" };
  }
} 