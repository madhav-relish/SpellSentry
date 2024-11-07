export type ServerActionResponse<T = void> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export function isActionError<T>(
  result: ServerActionResponse<T>
): result is { error: string } {
  return "error" in result;
} 