import { useState, useEffect } from 'react';
import { Language } from '../types';

// Using Monocles Translate API - a free and open-source machine translation service
// Based on LibreTranslate but doesn't require an API key
// More info: https://translate.monocles.de/
const PRIMARY_API = 'https://translate.monocles.de/translate';
// Fallback API in case the primary is down
const FALLBACK_API = 'https://translate.adminforge.de/translate';

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (
    text: string,
    sourceLang: Language,
    targetLang: Language
  ): Promise<string> => {
    if (!text) return '';
    
    setIsLoading(true);
    setError(null);

    // Try primary API first, then fallback if it fails
    const tryTranslate = async (apiUrl: string, isRetry = false) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify({
            q: text,
            source: sourceLang.code,
            target: targetLang.code,
            format: 'text',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Translation failed: ${errorData}`);
        }

        const data = await response.json();
        return data.translatedText;
      } catch (err) {
        if (!isRetry) {
          // If primary API failed, try the fallback
          return tryTranslate(FALLBACK_API, true);
        }
        // Both APIs failed
        const errorMessage = err instanceof Error ? err.message : 'Translation service is temporarily unavailable';
        setError(errorMessage);
        return '';
      }
    };

    try {
      const result = await tryTranslate(PRIMARY_API);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translate,
    isLoading,
    error,
  };
}