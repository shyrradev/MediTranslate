import { useState } from 'react';
import axios from 'axios';
import { Language } from '../types';

// Constants for our API endpoints
const HUGGING_FACE_API = 'https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M';
// Fallback to a traditional translation API if HF fails
const FALLBACK_API = 'https://translate.adminforge.de/translate';

// Cache for translations to reduce API calls
const translationCache: Record<string, string> = {};

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingAI, setIsUsingAI] = useState(true);

  const translate = async (
    text: string,
    sourceLang: Language,
    targetLang: Language
  ): Promise<string> => {
    // Clear any previous errors
    setError(null);
    
    // If no text, return empty string immediately
    if (!text || text.trim() === '') {
      return '';
    }
    
    // If source and target languages are the same, return original text
    if (sourceLang.code === targetLang.code) {
      return text;
    }

    // Create a cache key for this specific translation request
    const cacheKey = `${text}|${sourceLang.code}|${targetLang.code}`;
    
    // Check cache first to avoid unnecessary API calls
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    setIsLoading(true);
    
    try {
      // Try AI translation first
      if (isUsingAI) {
        try {
          // Convert language codes to NLLB format 
          // NLLB uses specific codes like eng_Latn, fra_Latn, etc.
          const sourceNLLB = convertToNLLBCode(sourceLang.code);
          const targetNLLB = convertToNLLBCode(targetLang.code);
          
          const response = await axios.post(
            HUGGING_FACE_API,
            {
              inputs: text,
              parameters: {
                source_language: sourceNLLB,
                target_language: targetNLLB,
                max_length: 512
              }
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' // No API key - using free tier
              },
              timeout: 10000 // 10-second timeout
            }
          );
          
          if (response.data && response.data.translation_text) {
            const result = response.data.translation_text;
            // Cache the result
            translationCache[cacheKey] = result;
            return result;
          }
          throw new Error('Invalid response format from AI translation');
        } catch (err) {
          console.warn('AI translation failed, falling back to traditional API', err);
          setIsUsingAI(false); // Switch to fallback for future translations
        }
      }

      // Fallback to traditional translation API
      const response = await fetch(FALLBACK_API, {
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
      
      // Cache the result
      translationCache[cacheKey] = data.translatedText;
      return data.translatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      
      // If everything fails, return an empty string
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translate,
    isLoading,
    error,
    isUsingAI
  };
}

// Helper function to convert ISO language codes to NLLB format
function convertToNLLBCode(langCode: string): string {
  // NLLB uses codes like eng_Latn, fra_Latn, etc.
  const codeMap: Record<string, string> = {
    'en': 'eng_Latn',
    'es': 'spa_Latn',
    'fr': 'fra_Latn',
    'de': 'deu_Latn',
    'ar': 'ara_Arab',
    'zh': 'zho_Hans',
    'hi': 'hin_Deva',
    'pt': 'por_Latn'
  };
  
  // Extract base language code (remove country variant if present)
  const baseCode = langCode.split('-')[0].toLowerCase();
  
  return codeMap[baseCode] || 'eng_Latn'; // Default to English if code not found
}