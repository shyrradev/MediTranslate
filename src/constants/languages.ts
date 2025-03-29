import { Language } from '../types';

// The 'code' is used for translation API
// The 'voiceCode' is used for speech synthesis (text-to-speech)
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', voiceCode: 'en-US' },
  { code: 'es', name: 'Spanish', voiceCode: 'es-ES' },
  { code: 'fr', name: 'French', voiceCode: 'fr-FR' },
  { code: 'de', name: 'German', voiceCode: 'de-DE' },
  { code: 'zh', name: 'Chinese', voiceCode: 'zh-CN' },
  { code: 'ar', name: 'Arabic', voiceCode: 'ar-SA' },
  { code: 'hi', name: 'Hindi', voiceCode: 'hi-IN' },
  { code: 'pt', name: 'Portuguese', voiceCode: 'pt-BR' },
];