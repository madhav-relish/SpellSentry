export interface SpellingError {
  word: string;
  suggestion: string;
  context: string;
  position: number;
  language: string;
}

export interface GrammarError {
  phrase: string;
  suggestion: string;
  context: string;
  position: number;
  explanation: string;
  language: string;
}

export interface GrammarCheckResponse {
  languages: string[];
  spelling: SpellingError[];
  grammar: GrammarError[];
} 