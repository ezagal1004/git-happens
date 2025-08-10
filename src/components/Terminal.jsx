'use client';
import { useState, useEffect, useRef } from 'react';
import { Circle } from 'lucide-react';

export default function Terminal({ prompt, choices, correctCommand, onCommand, onError }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Track cursor position changes
  const updateCursorPosition = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  // Auto-focus terminal input (desktop only)
  useEffect(() => {
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  // Handle command submission
  const handleSubmit = (command = input) => {
    if (!command.trim()) return;

    // Add to history
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Clear input
    setInput('');

    // Show typing effect
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Check if command is correct
      if (command === correctCommand) {
        onCommand(command);
      } else {
        // Determine which error message to use
        const correctParts = correctCommand.split(' ');
        const userParts = command.trim().split(' ');
        
        // Check if they got the main git command right (first 2 parts usually)
        const gotMainCommandRight = correctParts.length >= 2 && 
                                   userParts.length >= 2 && 
                                   userParts[0] === correctParts[0] && 
                                   userParts[1] === correctParts[1];
        
        // Trigger appropriate error
        if (gotMainCommandRight) {
          onError('close'); // They got the main command right but syntax wrong
        } else {
          onError('wrong'); // Completely wrong command
        }
      }
    }, 800);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        // Update cursor position after state update
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(history[newIndex].length, history[newIndex].length);
            setCursorPosition(history[newIndex].length);
          }
        }, 0);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
          setCursorPosition(0);
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
          // Update cursor position after state update
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(history[newIndex].length, history[newIndex].length);
              setCursorPosition(history[newIndex].length);
            }
          }, 0);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete with first matching choice
      const match = choices?.find(choice => 
        choice.toLowerCase().startsWith(input.toLowerCase())
      );
      if (match) {
        setInput(match);
        // Update cursor position after autocomplete
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(match.length, match.length);
            setCursorPosition(match.length);
          }
        }, 0);
      }
    }
    
    // Update cursor position for other keys
    setTimeout(updateCursorPosition, 0);
  };

  // Click terminal to focus
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden shadow-sm w-full min-w-0">
      {/* Terminal header */}
      <div className="bg-muted px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b min-w-0">
        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
          <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-500 text-red-500" />
          <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-500 text-yellow-500" />
          <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-green-500 text-green-500" />
        </div>
        <div className="text-muted-foreground text-xs sm:text-sm font-mono truncate min-w-0">
          git-tutorial-terminal
        </div>
      </div>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="bg-slate-950 text-slate-100 p-3 sm:p-4 font-mono text-xs sm:text-sm cursor-text min-h-[200px] sm:min-h-[300px] overflow-x-auto overflow-y-auto overscroll-contain"
        onClick={handleTerminalClick}
      >
        {/* Prompt text */}
        <div className="text-emerald-400 mb-3 sm:mb-4 leading-relaxed break-words overflow-wrap-anywhere">
          {prompt}
        </div>

        {/* Command history */}
        {history.map((cmd, index) => (
          <div key={index} className="mb-1 sm:mb-2 min-w-0">
            <div className="text-slate-400 break-all overflow-wrap-anywhere">
              <span className="text-emerald-400">user@git-tutorial</span>
              <span className="text-slate-300">:</span>
              <span className="text-sky-400">~</span>
              <span className="text-slate-300">$ </span>
              <span className="text-slate-100">{cmd}</span>
            </div>
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-start mb-3 sm:mb-4 min-w-0">
          <div className="flex-shrink-0 text-slate-400">
            <span className="text-emerald-400">user@git-tutorial</span>
            <span className="text-slate-300">:</span>
            <span className="text-sky-400">~</span>
            <span className="text-slate-300">$ </span>
          </div>
          <div className="flex-1 relative min-w-0 pl-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Update cursor position after input change
                setTimeout(updateCursorPosition, 0);
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={updateCursorPosition}
              onClick={updateCursorPosition}
              onSelect={updateCursorPosition}
              className="bg-transparent text-slate-100 outline-none w-full caret-transparent break-all resize-none"
              placeholder={isMobile ? "Tap to type command..." : ""}
              autoComplete="off"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              inputMode="text"
            />
            {!isMobile && (
              <span 
                className={`absolute top-0 text-slate-100 pointer-events-none ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                style={{ 
                  left: `${cursorPosition * 0.6}em`,
                  transform: 'translateX(0)' 
                }}
              >
                ▋
              </span>
            )}
          </div>
        </div>

        {/* Mobile-specific input hint */}
        {isMobile && !input && (
          <div className="text-slate-500 text-xs mb-2 italic">
            Tap the input area above to enter Git commands
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-amber-400 mb-3 sm:mb-4 flex items-center">
            <span className="animate-pulse">Processing command</span>
            <span className="ml-2 animate-bounce">...</span>
          </div>
        )}

        {/* Mobile command suggestions */}
        {isMobile && choices && choices.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-700">
            <div className="text-slate-400 text-xs mb-2">Quick commands:</div>
            <div className="flex flex-wrap gap-2">
              {choices.slice(0, 3).map((choice, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(choice);
                    setCursorPosition(choice.length);
                    if (inputRef.current) {
                      inputRef.current.focus();
                      setTimeout(() => {
                        inputRef.current.setSelectionRange(choice.length, choice.length);
                      }, 0);
                    }
                  }}
                  className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-600 hover:bg-slate-700 transition-colors touch-manipulation"
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}