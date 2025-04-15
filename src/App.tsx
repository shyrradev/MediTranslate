import React, { useState, useEffect } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { VoiceControl } from './components/VoiceControl';
import { Header } from './components/Header';
import { InfoModal } from './components/InfoModal';
import { TalkingAvatar } from './components/TalkingAvatar';
import { ApiKeyManager } from './components/ApiKeyManager'; // New component
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useGenerativeTranslation } from './hooks/useGenerativeTranslation'; // Updated hook
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { SUPPORTED_LANGUAGES } from './constants/languages';
import { Volume2, AlertCircle, RotateCcw, Copy, Loader2, Brain, Mic, Trash2, Info, RefreshCw } from 'lucide-react';
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
  const [speakingLanguage, setSpeakingLanguage] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const { isListening, transcript, error: speechError, toggleListening, clearTranscript, isBusy } = useSpeechRecognition(sourceLang);
  const { translate, isLoading, error: translationError, isUsingAI, model, toggleModel } = useGenerativeTranslation(apiKey, true);
  const { speak, isPlaying, error: speechSynthesisError } = useSpeechSynthesis();

  const [showAutoStartNotice, setShowAutoStartNotice] = useState<boolean>(false);
  const [translationHistory, setTranslationHistory] = useState<Array<{original: string, translated: string, timestamp: Date}>>([]);

  // Function to handle playing speech
  const handlePlaySpeech = () => {
    if (translatedText) {
      setSpeakingLanguage(targetLang.voiceCode || '');
      speak(translatedText, targetLang);
    }
  };

  // Save language preferences
  useEffect(() => {
    localStorage.setItem('sourceLang', JSON.stringify(sourceLang));
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem('targetLang', JSON.stringify(targetLang));
  }, [targetLang]);

  // Reset speaking language when speech synthesis is done
  useEffect(() => {
    if (!isPlaying) {
      setSpeakingLanguage('');
    }
  }, [isPlaying]);

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
      if (!transcript) {
        setTranslatedText('');
        return;
      }
      
      try {
        const result = await translate(transcript, sourceLang, targetLang);
        setTranslatedText(result);
        
        // Save to translation history
        if (result) {
          setTranslationHistory(prev => [
            { original: transcript, translated: result, timestamp: new Date() },
            ...prev.slice(0, 19) // Keep last 20 entries
          ]);
        }
      } catch (error) {
        console.error('Translation failed:', error);
      }
    };
    
    translateText();
  }, [transcript, sourceLang, targetLang, translate]);

  // Show notification if listening auto-started on page load
  useEffect(() => {
    if (isListening) {
      setShowAutoStartNotice(true);
      
      // Hide notice after 5 seconds
      const timer = setTimeout(() => {
        setShowAutoStartNotice(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isListening]);

  const error = speechError || translationError || speechSynthesisError;

  const handleCopyToClipboard = (text = translatedText) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onInfoClick={() => setIsInfoModalOpen(true)} />

      {/* Talking Avatar */}
      <TalkingAvatar 
        isPlaying={isPlaying} 
        language={speakingLanguage} 
      />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* API Key Manager (New) */}
        <ApiKeyManager onApiKeyChange={setApiKey} isUsingAI={isUsingAI} />
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Auto-start notification */}
        {showAutoStartNotice && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-between">
            <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              Speech recognition was automatically enabled from your last session.
            </p>
            <button 
              onClick={() => setShowAutoStartNotice(false)}
              className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={toggleModel}
              disabled={!apiKey}
              className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium ${
                isUsingAI 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Brain className="w-4 h-4" />
              {isUsingAI ? 'Using Generative AI' : 'Basic Translation'}
              {!apiKey && <span className="ml-1 text-xs">(API key required)</span>}
            </button>
          </div>
          <button 
            onClick={handleSwapLanguages}
            className="btn btn-secondary flex items-center gap-2"
            aria-label="Swap languages"
          >
            <RotateCcw className="w-4 h-4" />
            Swap Languages
          </button>
        </div>

        {/* Add status indicator for speech recognition */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex justify-between items-center">
          <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                Restarting speech recognition...
              </>
            ) : isListening ? (
              <>
                <Mic className="w-4 h-4 animate-pulse text-red-500" />
                Listening... Speak now
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Click the microphone button below to start listening
              </>
            )}
          </p>
          <div className="flex gap-2">
            {transcript && (
              <button
                onClick={clearTranscript}
                className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-300"
                aria-label="Clear transcript"
                disabled={isBusy}
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
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
            <div className="mt-4 relative">
              {isUsingAI && !isLoading && translatedText && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    Generative AI
                  </span>
                </div>
              )}
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
                  onClick={handlePlaySpeech}
                  className={`btn ${isPlaying ? 'bg-green-600 hover:bg-green-700' : 'btn-primary'} flex items-center gap-2`}
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Play Translation
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleCopyToClipboard()}
                  className="btn btn-secondary flex items-center gap-2"
                  aria-label="Copy translation to clipboard"
                >
                  <Copy className="w-5 h-5" />
                  Copy
                </button>
              </div>
            )}
            
            {targetLang.code === 'ar' && (
              <div className="mt-4 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>
                  Arabic text-to-speech may have limited support in some browsers. If playback doesn't work, try a different browser or copy the text instead.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <VoiceControl
            isListening={isListening}
            onToggle={toggleListening}
            isBusy={isBusy}
          />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            MediTranslate - Bridging language barriers in healthcare with AI. No patient data is stored or transmitted.
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