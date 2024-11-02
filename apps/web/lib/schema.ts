import { z } from "zod";

export const scanWebsiteSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});



export type ScanWebsiteInput = z.infer<typeof scanWebsiteSchema>;


export type ServerActionResponse<T = any> = 
  | { data: T; error?: never }
  | { data?: never; error: string };

export const isActionError = (
  response: ServerActionResponse
): response is { error: string } => {
  return 'error' in response;
};

export const withActionInstrumentation = <T extends (...args: any[]) => any>(
  actionName: string,
  fn: T
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      return { error: 'An unexpected error occurred' };
    }
  }) as T;
};

export interface ScanResult {
    spelling: Array<{
      incorrect: string;
      correction: string;
    }>;
    grammar: Array<{
      incorrect: string;
      correction: string;
    }>;
  }