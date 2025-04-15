import { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';

export function useSpeechRecognition(selectedLanguage: Language) {
  // Initialize isListening state from localStorage if available
  const [isListening, setIsListening] = useState<boolean>(() => {
    const saved = localStorage.getItem('isListening');
    // If the saved value exists and is "true", set initial state to true
    return saved === 'true';
  });
  
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  // Save isListening state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isListening', isListening.toString());
  }, [isListening]);

  useEffect(() => {
    let recognition: any = null;
    
    // Check browser support
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    
    try {
      // Initialize recognition
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage.code;
      
      // Event handlers
      recognition.onresult = (event: any) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript;
        }
        setTranscript(fullText);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        // Only report significant errors to the user, not "aborted" errors
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setError(`Error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        // Only attempt to restart if we're supposed to be listening
        // and we're not in the process of switching
        if (isListening && !isSwitching) {
          try {
            // Small delay to prevent rapid restart issues
            setTimeout(() => {
              recognition.start();
              console.log('Recognition restarted after end');
            }, 300);
          } catch (e) {
            console.error('Failed to restart recognition', e);
          }
        }
      };
      
      // Start/stop based on isListening state
      if (isListening && !isSwitching) {
        try {
          recognition.start();
          console.log('Speech recognition started');
        } catch (e) {
          console.error('Failed to start recognition', e);
          setError('Could not start speech recognition. Please try again in a moment.');
        }
      }
      
    } catch (e) {
      console.error('Error setting up speech recognition:', e);
      setError('Failed to set up speech recognition. Please refresh and try again.');
    }
    
    // Cleanup function
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isListening, selectedLanguage, isSwitching]);
  
  // Toggle listening state with a delay between stop/start
  const toggleListening = useCallback(() => {
    console.log('Toggle listening called, current state:', isListening);
    
    if (isListening) {
      // If currently listening, just stop
      setIsListening(false);
    } else {
      // If starting to listen, clear the transcript and add a delay
      setTranscript('');
      setError(null);
      
      // Use a switching state to prevent the useEffect from immediately
      // starting recognition before the previous one has fully stopped
      setIsSwitching(true);
      
      // Add a short delay before starting again to avoid the "aborted" error
      setTimeout(() => {
        setIsListening(true);
        // Wait a bit longer before allowing further toggling
        setTimeout(() => {
          setIsSwitching(false);
        }, 500);
      }, 300);
    }
  }, [isListening]);
  
  // Function to clear transcript without toggling listening
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    isListening,
    transcript,
    error,
    toggleListening,
    clearTranscript,
    isBusy: isSwitching
  };
}