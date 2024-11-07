import { NextRequest } from "next/server";

import { scanWebsite } from "@/lib/api/websites/controller";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scan = await scanWebsite(params.id);
    return Response.json({ data: scan });
  } catch (error) {
    console.error("POST /api/websites/[id]/scan error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 