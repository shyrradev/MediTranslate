import React, { useEffect, useRef, useState } from 'react';

interface TalkingAvatarProps {
  isPlaying: boolean;
  language: string;
}

export function TalkingAvatar({ isPlaying, language }: TalkingAvatarProps) {
  const [mouthOpening, setMouthOpening] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const animationRef = useRef<number | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headTiltTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get face style based on language
  const getFaceStyle = () => {
    // Use language code to determine avatar characteristics
    const baseStyles = {
      skinColor: '#f8d5c2',
      hairColor: '#593123',
      eyeColor: '#3e2723',
      lipColor: '#ec407a',
    };
    
    // Customize colors based on language
    switch (language.substring(0, 2)) {
      case 'ar': // Arabic
        return {
          ...baseStyles,
          skinColor: '#e3b78f',
          hairColor: '#291b10',
          eyeColor: '#332421', 
          lipColor: '#c2185b'
        };
      case 'zh': // Chinese
        return {
          ...baseStyles,
          skinColor: '#f2ccb6',
          hairColor: '#0f0f0f',
          eyeColor: '#321e14',
          lipColor: '#e91e63'
        };
      case 'fr': // French
        return {
          ...baseStyles,
          skinColor: '#f2d2c2',
          hairColor: '#6d4c41',
          eyeColor: '#1976d2',
          lipColor: '#d81b60'
        };
      case 'de': // German
        return {
          ...baseStyles,
          skinColor: '#f5e0d2',
          hairColor: '#f5c542',
          eyeColor: '#64b5f6',
          lipColor: '#ad1457'
        };
      case 'hi': // Hindi
        return {
          ...baseStyles,
          skinColor: '#d4a888',
          hairColor: '#211812',
          eyeColor: '#4e342e',
          lipColor: '#c2185b'
        };
      case 'es': // Spanish
        return {
          ...baseStyles,
          skinColor: '#e3b98c',
          hairColor: '#382218',
          eyeColor: '#3e2723',
          lipColor: '#d32f2f'
        };
      case 'pt': // Portuguese
        return {
          ...baseStyles,
          skinColor: '#e0b183',
          hairColor: '#3e2723',
          eyeColor: '#3b541f',
          lipColor: '#c2185b'
        };
      default: // English/Others
        return baseStyles;
    }
  };

  // Mouth animation effect
  useEffect(() => {
    let lastTime = 0;
    
    const animateMouth = (time: number) => {
      if (time - lastTime > 80) { // Change mouth every 80ms for smoother animation
        lastTime = time;
        // Random mouth opening when speaking with more natural variance
        if (isPlaying) {
          // Create a more natural speaking pattern with pauses
          const speakIntensity = Math.random();
          if (speakIntensity > 0.8) {
            setMouthOpening(Math.random() * 18); // Wide open
          } else if (speakIntensity > 0.4) {
            setMouthOpening(Math.random() * 12); // Medium open
          } else if (speakIntensity > 0.2) {
            setMouthOpening(Math.random() * 6); // Slightly open
          } else {
            setMouthOpening(0); // Brief pause
          }
        } else {
          setMouthOpening(0); // Mouth closed when not speaking
        }
      }
      
      animationRef.current = requestAnimationFrame(animateMouth);
    };
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateMouth);
    } else {
      setMouthOpening(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);
  
  // Blinking effect
  useEffect(() => {
    const startBlinking = () => {
      // Randomly blink every 1-5 seconds
      const blinkTimer = setTimeout(() => {
        setBlinking(true);
        
        // Eyes open after blinking
        setTimeout(() => {
          setBlinking(false);
          startBlinking();
        }, 150);
      }, Math.random() * 4000 + 1000);
      
      blinkTimerRef.current = blinkTimer;
    };
    
    startBlinking();
    
    return () => {
      if (blinkTimerRef.current) {
        clearTimeout(blinkTimerRef.current);
      }
    };
  }, []);
  
  // Occasional head tilt for more natural look
  useEffect(() => {
    const startHeadTilts = () => {
      // Randomly tilt head every 3-10 seconds
      const tiltTimer = setTimeout(() => {
        // Random tilt angle between -5 and 5 degrees
        setHeadTilt((Math.random() * 10) - 5);
        
        // Reset head position after a while
        setTimeout(() => {
          setHeadTilt(0);
          startHeadTilts();
        }, Math.random() * 1000 + 500);
      }, Math.random() * 7000 + 3000);
      
      headTiltTimerRef.current = tiltTimer;
    };
    
    startHeadTilts();
    
    return () => {
      if (headTiltTimerRef.current) {
        clearTimeout(headTiltTimerRef.current);
      }
    };
  }, []);
  
  // Only render when speech is playing
  if (!isPlaying) return null;
  
  const faceStyle = getFaceStyle();
  
  return (
    <div className="fixed bottom-20 right-8 z-10">
      <div 
        className="relative w-32 h-36 md:w-40 md:h-44"
        style={{ 
          transform: `rotate(${headTilt}deg)`,
          transition: 'transform 0.5s ease' 
        }}
      >
        {/* Head/Face */}
        <div 
          className="absolute inset-0 rounded-3xl shadow-md border-2 border-white"
          style={{ backgroundColor: faceStyle.skinColor }}
        />
        
        {/* Hair */}
        <div 
          className="absolute -top-4 left-0 right-0 h-16 rounded-t-3xl"
          style={{ backgroundColor: faceStyle.hairColor }}
        />
        
        {/* Bangs/Fringe */}
        <div 
          className="absolute top-0 left-0 right-0 h-6"
          style={{ 
            backgroundColor: faceStyle.hairColor,
            borderRadius: '1.5rem 1.5rem 50% 50%' 
          }}
        />
        
        {/* Eyes container */}
        <div className="absolute top-1/4 left-0 right-0 flex justify-center space-x-8">
          {/* Left eye */}
          <div className="relative w-5 h-4 md:w-6 md:h-5 bg-white rounded-full overflow-hidden">
            {/* Pupil */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                backgroundColor: faceStyle.eyeColor,
                transform: `scaleY(${blinking ? 0.1 : 1})`,
                transition: 'transform 0.05s ease',
                top: '15%', 
                left: '15%', 
                right: '15%', 
                bottom: '15%' 
              }}
            />
            
            {/* Eye shine */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-70" />
          </div>
          
          {/* Right eye */}
          <div className="relative w-5 h-4 md:w-6 md:h-5 bg-white rounded-full overflow-hidden">
            {/* Pupil */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                backgroundColor: faceStyle.eyeColor,
                transform: `scaleY(${blinking ? 0.1 : 1})`,
                transition: 'transform 0.05s ease',
                top: '15%', 
                left: '15%', 
                right: '15%', 
                bottom: '15%' 
              }}
            />
            
            {/* Eye shine */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-70" />
          </div>
        </div>
        
        {/* Eyebrows */}
        <div className="absolute top-[22%] left-0 right-0 flex justify-center space-x-10">
          <div className="w-4 h-1 rounded-full" style={{ backgroundColor: faceStyle.hairColor }} />
          <div className="w-4 h-1 rounded-full" style={{ backgroundColor: faceStyle.hairColor }} />
        </div>
        
        {/* Nose */}
        <div 
          className="absolute top-[43%] left-1/2 transform -translate-x-1/2 w-3 h-3"
          style={{
            borderLeft: '2px solid transparent',
            borderRight: '2px solid transparent',
            borderBottom: `2px solid ${faceStyle.skinColor}`,
            filter: 'brightness(0.9)'
          }}
        />
        
        {/* Cheeks */}
        <div className="absolute top-[48%] left-[15%] w-3 h-2 rounded-full bg-pink-300 opacity-30" />
        <div className="absolute top-[48%] right-[15%] w-3 h-2 rounded-full bg-pink-300 opacity-30" />
        
        {/* Animated Mouth */}
        <div 
          className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 rounded-lg overflow-hidden"
          style={{ 
            width: `${14 + (mouthOpening/2)}px`,
            height: `${mouthOpening}px`,
            backgroundColor: '#300000',
            border: `2px solid ${faceStyle.lipColor}`,
            borderTopWidth: '1px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          {/* Tongue (only visible when mouth is open enough) */}
          {mouthOpening > 8 && (
            <div
              className="absolute bottom-0 w-6 h-3 rounded-t-full"
              style={{ backgroundColor: '#ff8c94' }}
            />
          )}
        </div>
        
        {/* Chin */}
        <div 
          className="absolute bottom-0 left-1/2 right-0 h-12 w-16 transform -translate-x-1/2"
          style={{ 
            backgroundColor: faceStyle.skinColor,
            borderRadius: '0 0 50% 50%' 
          }}
        />
        
        {/* Speech bubble */}
        <div className="absolute -top-12 -left-32 md:-left-20 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-lg text-xs w-40 md:w-48">
          <div className="absolute bottom-0 right-8 w-4 h-4 bg-white dark:bg-gray-700 transform rotate-45 translate-y-2"></div>
          <p className="text-gray-800 dark:text-gray-200">
            Speaking in {language.split('-')[0].toUpperCase()}...
          </p>
        </div>
      </div>
    </div>
  );
} 