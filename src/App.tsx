import React, { useState, useEffect } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { VoiceControl } from './components/VoiceControl';
import { Header } from './components/Header';
import { InfoModal } from './components/InfoModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTranslation } from './hooks/useTranslation';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { SUPPORTED_LANGUAGES } from './constants/languages';
import { Volume2, AlertCircle, RotateCcw, Copy } from 'lucide-react';
import type { Language } from './types';

function App() {
  const [sourceLang, setSourceLang] = useState<Language>(() => {
    const saved = localStorage.getItem('sourceLang');
    return saved ? JSON.parse(saved) : SUPPORTED_LANGUAGES[0];
  });
  
  const [targetLang, setTargetLang] = useState<Language>(() => {
    const saved = localStorage.getItem('targetLang');
    return saved ? JSON.parse(saved) : SUPPORTED_LANGUAGES[1];
  });
  
  const [translatedText, setTranslatedText] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const { isListening, transcript, error: speechError, toggleListening } = useSpeechRecognition(sourceLang);
  const { translate, isLoading, error: translationError } = useTranslation();
  const { speak } = useSpeechSynthesis();

  // Save language preferences
  useEffect(() => {
    localStorage.setItem('sourceLang', JSON.stringify(sourceLang));
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem('targetLang', JSON.stringify(targetLang));
  }, [targetLang]);

  // Show the info modal on first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsInfoModalOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  useEffect(() => {
    const translateText = async () => {
      if (transcript) {
        const result = await translate(transcript, sourceLang, targetLang);
        setTranslatedText(result);
      }
    };
    
    translateText();
  }, [transcript, sourceLang, targetLang]);

  const error = speechError || translationError;

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onInfoClick={() => setIsInfoModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button 
            onClick={handleSwapLanguages}
            className="btn btn-secondary flex items-center gap-2"
            aria-label="Swap languages"
          >
            <RotateCcw className="w-4 h-4" />
            Swap Languages
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LanguageSelector
              selectedLanguage={sourceLang}
              onLanguageChange={setSourceLang}
              label="Source Language"
            />
            <div className="mt-4">
              <TranscriptDisplay
                text={transcript}
                isLoading={false}
                label="Original Speech"
              />
            </div>
          </div>

          <div>
            <LanguageSelector
              selectedLanguage={targetLang}
              onLanguageChange={setTargetLang}
              label="Target Language"
            />
            <div className="mt-4">
              <TranscriptDisplay
                text={translatedText}
                isTranslated
                isLoading={isLoading}
                label="Translation"
              />
            </div>
            
            {translatedText && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => speak(translatedText, targetLang)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Play Translation
                </button>
                
                <button
                  onClick={() => handleCopyToClipboard(translatedText)}
                  className="btn btn-secondary flex items-center gap-2"
                  aria-label="Copy translation to clipboard"
                >
                  <Copy className="w-5 h-5" />
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <VoiceControl
            isListening={isListening}
            onToggle={toggleListening}
          />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            MediTranslate - Bridging language barriers in healthcare. No patient data is stored or transmitted.
          </p>
        </div>
      </footer>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

export default App;