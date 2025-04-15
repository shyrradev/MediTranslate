import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceControlProps {
  isListening: boolean;
  onToggle: () => void;
  isBusy?: boolean;
}

export function VoiceControl({ isListening, onToggle, isBusy = false }: VoiceControlProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Only toggle if not busy
    if (!isBusy) {
      console.log('Toggling listening state. Current:', isListening);
      onToggle();
    } else {
      console.log('Speech recognition is busy, ignoring toggle request');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-4 rounded-full relative ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 wave-animation' 
          : isBusy 
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-primary-600 hover:bg-primary-700'
      } text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
        isListening 
          ? 'focus:ring-red-300' 
          : isBusy 
            ? 'focus:ring-yellow-300'
            : 'focus:ring-primary-300'
      }`}
      aria-label={
        isBusy 
          ? 'Speech recognition is processing' 
          : isListening 
            ? 'Stop listening' 
            : 'Start listening'
      }
      type="button"
      disabled={isBusy}
    >
      <span className={`absolute inset-0 rounded-full ${
        isListening 
          ? 'animate-pulse opacity-75 bg-red-500' 
          : isBusy 
            ? 'animate-pulse opacity-75 bg-yellow-500'
            : ''
      }`}></span>
      
      {isBusy ? (
        <Loader2 className="w-6 h-6 relative z-10 animate-spin" />
      ) : isListening ? (
        <MicOff className="w-6 h-6 relative z-10" />
      ) : (
        <Mic className="w-6 h-6 relative z-10" />
      )}
    </button>
  );
}