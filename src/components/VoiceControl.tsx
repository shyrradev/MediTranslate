import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceControlProps {
  isListening: boolean;
  onToggle: () => void;
}

export function VoiceControl({ isListening, onToggle }: VoiceControlProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-4 rounded-full relative ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 wave-animation' 
          : 'bg-primary-600 hover:bg-primary-700'
      } text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
        isListening ? 'focus:ring-red-300' : 'focus:ring-primary-300'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      <span className={`absolute inset-0 rounded-full ${isListening ? 'animate-pulse opacity-75 bg-red-500' : ''}`}></span>
      {isListening ? (
        <MicOff className="w-6 h-6 relative z-10" />
      ) : (
        <Mic className="w-6 h-6 relative z-10" />
      )}
    </button>
  );
}