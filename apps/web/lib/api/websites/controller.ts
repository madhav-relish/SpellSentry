import { prisma } from "@/lib/prisma";
import { Website } from "@prisma/client";

export async function getWebsites(userId: string): Promise<Website[]> {
  return prisma.website.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addWebsite({
  url,
  userId,
}: {
  url: string;
  userId: string;
}): Promise<Website> {
  return prisma.website.create({
    data: { url, userId },
  });
} 