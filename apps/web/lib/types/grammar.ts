export interface SpellingError {
  word: string;
  suggestion: string;
  context: string;
  position: number;
}

export interface GrammarError {
  phrase: string;
  suggestion: string;
  context: string;
  position: number;
  explanation: string;
}

export interface GrammarCheckResponse {
  spelling: SpellingError[];
  grammar: GrammarError[];
} 