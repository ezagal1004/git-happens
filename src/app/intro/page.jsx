'use client';
import AudioReactiveIcon from '@/components/AudioReactiveIcon';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const getCleanText = (words) => {
  return words.join(' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
};

export default function GitIntroScreen() {
  const audioSrc = "/alex-intro.mp3";
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);
  const [showTerminalView, setShowTerminalView] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Auto-trigger audio playback on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find the audio icon and trigger click
      const audioIcon = document.querySelector('[data-audio-icon]');
      if (audioIcon) {
        audioIcon.click();
      }
    }, 1000); // Give component time to fully mount

    return () => clearTimeout(timer);
  }, []);

  // Timestamp data for Git introduction
  const timestampData = [
    {
      start: 0,
      words: ["Here's", "the", "thing", "about", "sharing", "your", "code", "with", "the", "world..."]
    },
    {
      start: 4.5,
      words: ["You", "need", "a", "way", "to", "track", "changes,", "backup", "your", "work,", "and", "collaborate."]
    },
    {
      start: 10.2,
      words: ["That's", "where", "Git", "comes", "in", "-", "think", "of", "it", "as", "a", "time", "machine", "for", "your", "code."]
    },
    {
      start: 16.8,
      words: ["Let's", "start", "with", "your", "very", "first", "Git", "command."]
    }
  ];

  const expectedCommand = "git init";

  // Listen for audio time updates
  useEffect(() => {
    const handleAudioUpdate = (event) => {
      if (event.detail) {
        const { currentTime, isPlaying, duration } = event.detail;
        setIsAudioPlaying(isPlaying);
        
        // Track if audio has started
        if (isPlaying && currentTime > 0) {
          setHasAudioStarted(true);
        }
        
        // Multiple ways to detect completion for reliability
        const hasReachedEnd = duration && currentTime >= duration - 0.5;
        const hasPassedLastSegment = currentTime >= timestampData[timestampData.length - 1].start + 3;
        const stoppedAfterPlaying = hasAudioStarted && !isPlaying && currentTime > 15;
        
        if (hasReachedEnd || hasPassedLastSegment || stoppedAfterPlaying) {
          setAudioCompleted(true);
        }
        
        if (isPlaying && currentTime > 0) {
          // Find which segment should be active based on current time
          let activeSegment = 0;
          for (let i = timestampData.length - 1; i >= 0; i--) {
            if (currentTime >= timestampData[i].start) {
              activeSegment = i;
              break;
            }
          }
          
          if (activeSegment !== currentSegment) {
            setCurrentSegment(activeSegment);
          }
        }
      }
    };

    window.addEventListener('audioUpdate', handleAudioUpdate);
    
    return () => {
      window.removeEventListener('audioUpdate', handleAudioUpdate);
    };
  }, [currentSegment, timestampData, hasAudioStarted]);

  // Validate user input
  useEffect(() => {
    const trimmedInput = userInput.trim().toLowerCase();
    const expectedLower = expectedCommand.toLowerCase();
    
    if (trimmedInput === expectedLower) {
      setIsCorrect(true);
      setShowValidation(true);
    } else if (trimmedInput.length > 0) {
      setIsCorrect(false);
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }
  }, [userInput, expectedCommand]);

  const handleContinueClick = () => {
    setShowTerminalView(true);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isCorrect) {
      // Move to next step
      console.log('User successfully entered git init!');
    }
  };

  const shouldShowContent = isAudioPlaying || audioCompleted;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      <AnimatePresence mode="wait">
        {!showTerminalView ? (
          // Audio & Text View
          <motion.div
            key="audio-view"
            exit={{ 
              opacity: 0,
              scale: 0.95,
              transition: { 
                duration: 0.5,
                ease: "easeIn"
              }
            }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            {/* Audio Icon */}
            <motion.div
              animate={{ 
                y: shouldShowContent ? -200 : 0 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.6
              }}
              className="z-10"
            >
              <div data-audio-icon>
                <AudioReactiveIcon audioFile={audioSrc} className="w-16 h-16" />
              </div>
            </motion.div>

            {/* Content Container */}
            <AnimatePresence mode="wait">
              {shouldShowContent && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 flex flex-col justify-center items-center max-w-4xl mx-auto px-4"
                >
                  {/* Text Content */}
                  <div className="text-center space-y-3 mb-16">
                    {timestampData.map((segment, index) => {
                      const isCurrentSegment = index === currentSegment && isAudioPlaying;
                      const isCompletedSegment = index <= currentSegment;
                      
                      return (
                        <motion.div
                          key={index}
                          animate={{ 
                            opacity: isCompletedSegment ? 1 : 0.4,
                            scale: isCurrentSegment ? 1.05 : 1
                          }}
                          transition={{ 
                            duration: 0.3,
                            ease: "easeInOut"
                          }}
                          className={`text-xl leading-relaxed transition-colors duration-300 ${
                            isCompletedSegment 
                              ? 'text-gray-100' 
                              : 'text-gray-600'
                          }`}
                        >
                          "{getCleanText(segment.words)}"
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  {audioCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.5,
                        ease: "easeOut"
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinueClick}
                        className="bg-white text-black px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                      >
                        Continue
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Terminal View
          <motion.div
            key="terminal-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="w-full h-full flex flex-col items-center justify-center max-w-4xl mx-auto"
          >
            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Let's Try Your First Git Command</h2>
              <p className="text-gray-300 text-lg">
                Type <code className="bg-gray-800 px-2 py-1 rounded text-yellow-300 font-mono">git init</code> in the terminal below and press Enter
              </p>
            </motion.div>

            {/* Virtual Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl"
            >
              {/* Terminal Header */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">Terminal</span>
              </div>
              
              {/* Terminal Content */}
              <div className="font-mono">
                <div className="flex items-center text-green-400 mb-2">
                  <span className="text-blue-400">user@computer</span>
                  <span className="text-white">:</span>
                  <span className="text-purple-400">~/my-project</span>
                  <span className="text-white">$ </span>
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border-none outline-none text-yellow-300 flex-1 font-mono"
                    placeholder="Type your command here..."
                    autoFocus
                  />
                </div>
                
                {/* Validation Feedback */}
                {showValidation && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm mt-2 ${
                      isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="flex items-center space-x-2">
                        <span>✓</span>
                        <span>Perfect! Press Enter to initialize your Git repository.</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>✗</span>
                        <span>Not quite right. Try typing "git init"</span>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Success message after correct command */}
                {isCorrect && userInput.trim() && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-300 mt-4 p-3 bg-gray-800 rounded border-l-4 border-green-500"
                  >
                    <div className="text-green-400 font-semibold mb-1">What this does:</div>
                    <div className="text-sm">
                      <code>git init</code> creates a new Git repository in your current folder. 
                      It's like telling Git: "Hey, start tracking changes in this project!"
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Next Step Button */}
            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => console.log('Moving to next step!')}
                  className="bg-green-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
                >
                  Great! What's next?
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}