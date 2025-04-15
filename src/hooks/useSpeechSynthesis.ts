import { useCallback, useState, useRef } from 'react';
import { Language } from '../types';

// Define language codes for type-safe access
type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'hi' | 'pt';

// AI-enhanced speech synthesis parameters
const SPEECH_AI_PARAMS = {
  // Pitch modulation based on language
  pitchVariations: {
    'en': 1.0,    // English - neutral pitch
    'es': 1.05,   // Spanish - slightly higher pitch
    'fr': 1.0,    // French - neutral pitch
    'de': 0.95,   // German - slightly lower pitch
    'zh': 1.1,    // Chinese - higher pitch
    'ar': 0.98,   // Arabic - slightly lower pitch
    'hi': 1.05,   // Hindi - slightly higher pitch
    'pt': 1.02,   // Portuguese - slightly higher pitch
  } as Record<LanguageCode, number>,
  // Rate modulation based on language
  rateVariations: {
    'en': 1.0,    // English - neutral rate
    'es': 1.05,   // Spanish - slightly faster
    'fr': 0.98,   // French - slightly slower
    'de': 0.95,   // German - slower
    'zh': 0.9,    // Chinese - slower
    'ar': 0.9,    // Arabic - slower
    'hi': 0.95,   // Hindi - slightly slower
    'pt': 1.02,   // Portuguese - slightly faster
  } as Record<LanguageCode, number>,
  // Natural pauses to add at punctuation for more natural speech
  pauseDurations: {
    ',': 250,     // Short pause at commas
    '.': 500,     // Medium pause at periods
    '!': 450,     // Medium pause at exclamation points
    '?': 450,     // Medium pause at question marks
    ';': 350,     // Medium-short pause at semicolons
    ':': 350,     // Medium-short pause at colons
  }
};

export function useSpeechSynthesis() {
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // AI-enhanced voice selection logic
  const getOptimalVoice = (languageCode: string) => {
    // Get all available voices
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      return null; // No voices available
    }
    
    // Try multiple matching strategies in order of preference
    
    // 1. Try to find a voice that exactly matches the language code and is neural/premium
    let voice = voices.find(v => 
      v.lang.toLowerCase() === languageCode.toLowerCase() && 
      (v.name.toLowerCase().includes('neural') || 
       v.name.toLowerCase().includes('premium') ||
       v.name.toLowerCase().includes('enhanced'))
    );
    
    // 2. Try to find an exact match for the language code
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase() === languageCode.toLowerCase());
    }
    
    // 3. Try to find a voice that starts with the language code (e.g., 'en-US' would match for 'en')
    if (!voice) {
      const langPrefix = languageCode.split('-')[0];
      voice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix.toLowerCase()));
    }

    // 4. Special case handling for languages with common variants
    if (!voice) {
      const langPrefix = languageCode.split('-')[0];
      
      if (langPrefix === 'en') {
        // Try common English variants
        voice = voices.find(v => /^en[-_]/.test(v.lang.toLowerCase()));
      } 
      else if (langPrefix === 'ar') {
        // Try common Arabic variants
        voice = voices.find(v => 
          v.lang.toLowerCase().startsWith('ar') || 
          v.name.toLowerCase().includes('arab')
        );
      }
      else if (langPrefix === 'zh') {
        // Try common Chinese variants
        voice = voices.find(v => 
          v.lang.toLowerCase().startsWith('zh') || 
          v.name.toLowerCase().includes('chinese') ||
          v.name.toLowerCase().includes('mandarin')
        );
      }
    }

    // 5. Last resort: just use the default voice
    if (!voice && voices.length > 0) {
      voice = voices.find(v => v.default) || voices[0];
    }

    return voice;
  };

  // Add natural-sounding pauses at punctuation
  const processTextForNaturalSpeech = (text: string) => {
    // Insert SSML-like pauses at punctuation for more natural speech
    // (Browser speech synthesis doesn't support SSML, so we simulate it)
    let processedText = text;
    
    // Replace multiple spaces with single spaces
    processedText = processedText.replace(/\s+/g, ' ');
    
    // Ensure there's space after punctuation for better phrasing
    processedText = processedText.replace(/([.,;:!?])([^\s])/g, '$1 $2');
    
    return processedText;
  };

  const speak = useCallback((text: string, language: Language) => {
    if (!text) return;
    setError(null);

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Pre-process text for more natural speech
      const processedText = processTextForNaturalSpeech(text);
      
      // Create the utterance
      const utterance = new SpeechSynthesisUtterance(processedText);
      utteranceRef.current = utterance;
      
      // Use voiceCode if available, otherwise fall back to code
      const langCode = language.voiceCode || language.code;
      utterance.lang = langCode;
      
      // Get the language base code (e.g., 'en' from 'en-US')
      const baseCode = langCode.split('-')[0].toLowerCase() as LanguageCode;
      
      // Apply AI-optimized speech parameters
      utterance.pitch = SPEECH_AI_PARAMS.pitchVariations[baseCode] || 1.0;
      utterance.rate = SPEECH_AI_PARAMS.rateVariations[baseCode] || 1.0;
      
      // Make sure voices are loaded (can be async in some browsers)
      if (window.speechSynthesis.getVoices().length === 0) {
        // If voices are not loaded yet, wait a bit and try again
        setTimeout(() => {
          const voice = getOptimalVoice(langCode);
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }, 100);
      } else {
        // If voices are loaded, use them directly
        const voice = getOptimalVoice(langCode);
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }

      // Add event handlers
      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        setError(`Error playing speech: ${event.error}`);
        setIsPlaying(false);
      };
    } catch (err) {
      setError('Speech synthesis is not supported or another error occurred.');
      setIsPlaying(false);
      console.error('Speech synthesis error:', err);
    }
  }, []);

  return { speak, isPlaying, error };
}