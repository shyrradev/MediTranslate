import React, { Fragment, useRef } from 'react';
import { X, Mic, Globe, Volume2, Save, Clock, Moon } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
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
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Speech Recognition</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Click the microphone button to start/stop listening.</p>
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