import { useCallback } from 'react';
import { Language } from '../types';

export function useSpeechSynthesis() {
  const speak = useCallback((text: string, language: Language) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language.code;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}