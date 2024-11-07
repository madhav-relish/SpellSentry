import { z } from "zod";

export const addWebsiteSchema = z.object({
  url: z.string().url(),
});

export function validateAddWebsite(data: unknown) {
  return addWebsiteSchema.safeParse(data);
} 