'use client';
import { useState, useEffect, useRef } from 'react';

export default function Terminal({ prompt, choices, correctCommand, onCommand, onError }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus terminal input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        // Clear command history on error and trigger error in parent component
        setHistory([]);
        onError();
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
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete with first matching choice
      const match = choices.find(choice => 
        choice.toLowerCase().startsWith(input.toLowerCase())
      );
      if (match) {
        setInput(match);
      }
    }
  };

  // Click terminal to focus
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-black rounded-lg border border-gray-600 overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-gray-600">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-400 text-sm font-mono ml-4">
          git-tutorial-terminal ~ zsh
        </div>
      </div>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="p-4 font-mono text-sm cursor-text min-h-[300px]"
        onClick={handleTerminalClick}
      >
        {/* Prompt text */}
        <div className="text-green-400 mb-4 leading-relaxed">
          {prompt}
        </div>

        {/* Command history */}
        {history.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="text-blue-400">
              <span className="text-green-400">user@git-tutorial</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$ </span>
              <span className="text-white">{cmd}</span>
            </div>
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center mb-4">
          <span className="text-green-400">user@git-tutorial</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white outline-none w-full caret-transparent pl-1"
              placeholder=""
              autoComplete="off"
              spellCheck="false"
            />
            <span 
              className={`absolute top-0 text-white pointer-events-none ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}
              style={{ 
                left: `${0.25 + (input.length * 0.6)}em`,
                transform: 'translateX(0)' 
              }}
            >
              ▋
            </span>
          </div>
        </div>

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-yellow-400 mb-4 flex items-center">
            <span className="animate-pulse">Processing command</span>
            <span className="ml-2 animate-bounce">...</span>
          </div>
        )}
      </div>
    </div>
  );
}