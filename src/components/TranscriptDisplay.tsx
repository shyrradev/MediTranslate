import React from 'react';
import { ThumbsUp, Languages } from 'lucide-react';

interface TranscriptDisplayProps {
  text: string;
  isTranslated?: boolean;
  isLoading?: boolean;
  label?: string;
}

export function TranscriptDisplay({ 
  text, 
  isTranslated, 
  isLoading,
  label 
}: TranscriptDisplayProps) {
  return (
    <div className={`card min-h-[150px] relative overflow-hidden ${isTranslated ? 'border-l-4 border-primary-500' : ''}`}>
      {label && (
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {isTranslated ? (
            <Languages className="w-4 h-4 text-primary-500" />
          ) : (
            <ThumbsUp className="w-4 h-4 text-secondary-500" />
          )}
          {label}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      ) : (
        <div className={`${text ? 'animate-fadeIn' : ''}`}>
          <p className={`text-lg ${isTranslated ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-800 dark:text-gray-200'}`}>
            {text || 'Waiting for speech...'}
          </p>
        </div>
      )}

      {isTranslated && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 opacity-75"></div>
        </div>
      )}
    </div>
  );
}