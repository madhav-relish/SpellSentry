import { z } from "zod";

export const scanWebsiteSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type ScanWebsiteInput = z.infer<typeof scanWebsiteSchema>;

export const scanRequestSchema = z.object({
    url: z.string().url()
  });