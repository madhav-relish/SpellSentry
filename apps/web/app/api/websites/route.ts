import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { addWebsite, getWebsites } from "@/lib/api/websites/controller";
import { validateAddWebsite } from "@/lib/api/websites/validator";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websites = await getWebsites(session.user.id);
    return Response.json({ data: websites });
  } catch (error) {
    console.error("GET /api/websites error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = validateAddWebsite(body);
    if (!validationResult.success) {
      return Response.json({ error: validationResult.error }, { status: 400 });
    }

    const website = await addWebsite({
      url: body.url,
      userId: session.user.id,
    });

    return Response.json({ data: website });
  } catch (error) {
    console.error("POST /api/websites error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 