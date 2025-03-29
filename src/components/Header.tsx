import React from 'react';
import { HeartPulse, Info } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onInfoClick?: () => void;
}

export function Header({ onInfoClick }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              MediTranslate
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {onInfoClick && (
              <button
                onClick={onInfoClick}
                className="p-2 rounded-full transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-gray-600"
                aria-label="Information about the app"
              >
                <Info className="w-5 h-5" />
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
} 