import React, { Fragment, useRef, useState } from 'react';
import { X, Mic, Globe, Volume2, Save, Clock, Moon, CheckCircle2, Brain, MessageSquare } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [voiceInfo, setVoiceInfo] = useState<string[]>([]);
  const [showVoiceInfo, setShowVoiceInfo] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  const checkAvailableVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      setVoiceInfo(['No voices available in your browser.']);
    } else {
      const voiceList = voices.map(voice => 
        `${voice.name} (${voice.lang})${voice.default ? ' - Default' : ''}`
      );
      setVoiceInfo(voiceList);
    }
    setShowVoiceInfo(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto card"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            How to Use MediTranslate
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-primary-500 pl-4 py-2">
            <p className="text-gray-700 dark:text-gray-300">
              MediTranslate helps bridge language barriers in healthcare settings by providing real-time speech translation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Key Features</h3>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">AI-Powered Translation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Utilizes advanced neural machine translation for more natural and accurate translations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Speech Recognition</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Click the microphone button to start/stop listening.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Animated Avatar</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">A charming avatar appears during translation playback with unique visual traits for each language.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Language Selection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select source and target languages from the dropdown menus.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Text-to-Speech</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Click the speaker button to hear the translation spoken aloud.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes for comfortable use in any environment.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Speak clearly and at a moderate pace for best results</li>
              <li>Use short, simple sentences for more accurate translations</li>
              <li>Ensure you're in a quiet environment for better speech recognition</li>
              <li>Works best in Chrome, Edge, and Safari browsers</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About AI Translation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              MediTranslate uses state-of-the-art neural machine translation technology from Hugging Face to provide high-quality translations. The app intelligently falls back to traditional translation methods if AI translation is temporarily unavailable.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-purple-700 dark:text-purple-300">Neural translation provides more natural and contextually accurate results.</p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Voice Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Text-to-speech functionality varies by browser and language. Some languages like Arabic may have limited support in certain browsers.
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={checkAvailableVoices}
                className="btn btn-primary text-sm py-1"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Check Voice Support
              </button>
              
              {showVoiceInfo && (
                <div className="mt-2 text-xs bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 max-h-32 overflow-auto">
                  <p className="font-medium mb-1">Available voices in your browser:</p>
                  <ul className="space-y-1">
                    {voiceInfo.map((voice, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">{voice}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full btn btn-primary"
        >
          Got it
        </button>
      </div>
    </div>
  );
} 