import React, { useState, useEffect } from 'react';
import { Key, Check, X, Eye, EyeOff, Brain, AlertTriangle } from 'lucide-react';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string | null) => void;
  isUsingAI: boolean;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ 
  onApiKeyChange,
  isUsingAI
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Load saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('translationApiKey');
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
      setIsSaved(true);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('translationApiKey', apiKey);
      onApiKeyChange(apiKey);
      setIsSaved(true);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('translationApiKey');
    setApiKey('');
    onApiKeyChange(null);
    setIsSaved(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Key Management
        </h3>
        
        {isUsingAI ? (
          <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-300">
            <Check className="w-4 h-4" />
            <span>Generative AI Active</span>
          </div>
        ) : (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Using Basic Translation</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
            <Brain className="w-4 h-4" />
            Unlock enhanced generative AI translation by adding your API key
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key here"
                className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            
            {isSaved && (
              <button
                onClick={handleClearApiKey}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Your API key is stored locally in your browser and never sent to our servers. 
            It's used directly from your browser to access enhanced translation capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};