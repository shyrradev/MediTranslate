import { useState, useCallback } from 'react';
import type { Language } from '../types';

interface UseGenerativeTranslationReturn {
  translate: (text: string, sourceLang: Language, targetLang: Language) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  isUsingAI: boolean;
  model: string;
  resetError: () => void;
}

// Available models configuration
const MODELS = {
  DEFAULT: 'neural-translation',
  GENERATIVE: 'gpt-translation'
};

/**
 * Enhanced translation hook that supports both traditional neural translation
 * and generative AI translation based on LLMs
 */
export const useGenerativeTranslation = (
  apiKey?: string, 
  preferGenerative: boolean = true
): UseGenerativeTranslationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<string>(
    apiKey && preferGenerative ? MODELS.GENERATIVE : MODELS.DEFAULT
  );

  // Reset error state
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Determine if we're using generative AI
  const isUsingAI = model === MODELS.GENERATIVE;

  const translate = useCallback(
    async (text: string, sourceLang: Language, targetLang: Language): Promise<string> => {
      if (!text.trim()) {
        return '';
      }

      setIsLoading(true);
      setError(null);

      try {
        // If we have an API key and want to use generative translation
        if (apiKey && model === MODELS.GENERATIVE) {
          // Use generative AI model for translation with system prompt
          const response = await fetch('https://api.example.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4-turbo", // or other appropriate model
              messages: [
                {
                  role: "system",
                  content: `You are a professional translator. Translate the following text from ${sourceLang.name} to ${targetLang.name}. 
                  Preserve the meaning, tone, and cultural nuances as much as possible. 
                  For medical terminology, ensure accurate and precise translation.
                  Only respond with the translated text, no explanations or notes.`
                },
                {
                  role: "user",
                  content: text
                }
              ],
              temperature: 0.3 // Lower temperature for more accurate translations
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to translate using AI model');
          }

          const data = await response.json();
          return data.choices[0].message.content.trim();
        } else {
          // Fall back to traditional translation API
          const encodedText = encodeURIComponent(text);
          const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang.code}&tl=${targetLang.code}&dt=t&q=${encodedText}`
          );

          if (!response.ok) {
            throw new Error('Translation request failed');
          }

          const data = await response.json();
          // Extract translation from the response
          return data[0]
            .map((sentence: any) => sentence[0])
            .join(' ');
        }
      } catch (err: any) {
        console.error('Translation error:', err);
        setError(err.message || 'An unknown error occurred during translation');
        // Return the original text if translation fails
        return text;
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, model]
  );

  // Function to toggle between models
  const toggleModel = useCallback(() => {
    if (!apiKey && model !== MODELS.DEFAULT) {
      setError('API key required for generative AI translation');
      setModel(MODELS.DEFAULT);
      return;
    }
    
    setModel(prevModel => 
      prevModel === MODELS.DEFAULT ? MODELS.GENERATIVE : MODELS.DEFAULT
    );
  }, [apiKey, model]);

  return {
    translate,
    isLoading,
    error,
    isUsingAI,
    model,
    resetError,
    toggleModel // Added for convenience
  };
};