export interface GrammarError {
  word: string;
  suggestion: string;
  context: string;
  position: number;
}

export interface GrammarCheckResponse {
  errors: GrammarError[];
} 