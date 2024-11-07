import { prisma } from "@/lib/prisma";
import { Website, Scan } from "@prisma/client";
import { scrapeWebsite } from "@/lib/scraper";
import { checkGrammar } from "@/lib/ai/grammar-check";
import { GrammarError } from '@/lib/types/grammar';

export async function getWebsites(userId: string): Promise<Website[]> {
  return prisma.website.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
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

export async function scanWebsite(websiteId: string): Promise<Scan> {
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
  });

  if (!website) {
    throw new Error('Website not found');
  }

  const content = await scrapeWebsite(website.url);
  const grammarErrors = await checkGrammar(content);

  const scan = await prisma.scan.create({
    data: {
      websiteId,
      content,
      errors: {
        create: grammarErrors.map((error: GrammarError) => ({
          word: error.word,
          suggestion: error.suggestion,
          context: error.context,
          position: error.position,
        })),
      },
    },
    include: {
      errors: true,
    },
  });

  return scan;
} 