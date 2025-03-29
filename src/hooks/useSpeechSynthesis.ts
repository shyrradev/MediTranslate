import { useCallback, useState } from 'react';
import { Language } from '../types';

export function useSpeechSynthesis() {
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Checks if a voice is available for the language
  const getVoiceForLanguage = (languageCode: string) => {
    // Get all available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find an exact match for the language code
    let voice = voices.find(voice => voice.lang.toLowerCase() === languageCode.toLowerCase());
    
    // If no exact match, try to find a voice that starts with the language code
    // (e.g., 'ar-SA' would match for 'ar')
    if (!voice) {
      const langPrefix = languageCode.split('-')[0];
      voice = voices.find(voice => voice.lang.toLowerCase().startsWith(langPrefix.toLowerCase()));
    }

    // Special case for Arabic
    if (languageCode === 'ar-SA' || languageCode === 'ar') {
      // Try common Arabic voice codes
      const arabicVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith('ar') || 
        v.name.toLowerCase().includes('arab')
      );
      if (arabicVoices.length > 0) {
        voice = arabicVoices[0];
      }
    }

    return voice;
  };

  const speak = useCallback((text: string, language: Language) => {
    if (!text) return;
    setError(null);

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create the utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use voiceCode if available, otherwise fall back to code
      const langCode = language.voiceCode || language.code;
      utterance.lang = langCode;
      
      // Make sure voices are loaded (can be async in some browsers)
      if (window.speechSynthesis.getVoices().length === 0) {
        // If voices are not loaded yet, wait a bit and try again
        setTimeout(() => {
          const voice = getVoiceForLanguage(langCode);
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }, 100);
      } else {
        // If voices are loaded, use them directly
        const voice = getVoiceForLanguage(langCode);
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