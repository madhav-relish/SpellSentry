import { ServerActionResponse } from "@/lib/types/actions";
import { Website } from "@prisma/client";

export async function addWebsiteAction(
  url: string
): Promise<ServerActionResponse<Website>> {
  try {
    const response = await fetch("/api/websites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to add website" };
    }

    return { data: data.data };
  } catch (error) {
    return { error: "Failed to add website" };
  }
} 