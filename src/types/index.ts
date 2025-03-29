export interface Language {
  code: string;
  name: string;
}

export interface TranscriptEntry {
  text: string;
  timestamp: number;
  isTranslated: boolean;
}

export interface TranslationEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: number;
}

export interface TranslationState {
  isListening: boolean;
  originalText: string;
  translatedText: string;
  selectedSourceLang: Language;
  selectedTargetLang: Language;
  error: string | null;
  isLoading: boolean;
}