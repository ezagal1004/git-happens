'use client';
import { useEffect, useState } from 'react';

export default function Tooltip({ show, content, position, delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId;

    if (show && content) {
      timeoutId = setTimeout(() => {
        setIsVisible(true);
        
        // Calculate optimal tooltip position
        const tooltipWidth = 300; // Approximate width
        const tooltipHeight = 80; // Approximate height
        const padding = 16;
        
        let x = position.x;
        let y = position.y - tooltipHeight - padding;
        
        // Adjust if tooltip would go off screen
        if (x + tooltipWidth > window.innerWidth) {
          x = window.innerWidth - tooltipWidth - padding;
        }
        if (x < padding) {
          x = padding;
        }
        if (y < padding) {
          y = position.y + padding; // Show below cursor instead
        }
        
        setTooltipPosition({ x, y });
      }, delay);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [show, content, position, delay]);

  if (!isVisible || !content) {
    return null;
  }

  return (
    <>
      {/* Backdrop to catch mouse events */}
      <div className="fixed inset-0 pointer-events-none z-40" />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
        }}
      >
        {/* Tooltip container */}
        <div className="relative">
          {/* Main tooltip */}
          <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl p-4 max-w-sm">
            {/* Header with Git icon */}
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center mr-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                  <path fill="currentColor" d="M21.62 11.108L12.892 2.38c-.51-.51-1.365-.51-1.876 0L9.596 3.8l2.588 2.588c.544-.184 1.168-.064 1.604.372.436.436.556 1.06.372 1.604l2.492 2.492c.544-.184 1.168-.064 1.604.372.61.61.61 1.598 0 2.208-.61.61-1.598.61-2.208 0-.456-.456-.568-1.128-.336-1.692L12.2 8.232v5.436c.148.072.288.168.416.296.61.61.61 1.598 0 2.208-.61.61-1.598.61-2.208 0-.61-.61-.61-1.598 0-2.208.152-.152.32-.264.496-.336V8.28c-.176-.072-.344-.184-.496-.336-.456-.456-.568-1.128-.336-1.692L7.484 3.664 2.38 8.768c-.51.51-.51 1.365 0 1.876l8.728 8.728c.51.51 1.365.51 1.876 0l8.636-8.636c.51-.51.51-1.365 0-1.876z"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-300">Git Command Help</span>
            </div>
            
            {/* Content */}
            <div className="text-white text-sm leading-relaxed">
              {content}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>💡 Hover for explanations</span>
                <span className="flex items-center">
                  <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">ESC</kbd>
                  <span className="ml-1">to dismiss</span>
                </span>
              </div>
            </div>
          </div>

          {/* Arrow pointing to target */}
          <div 
            className="absolute w-3 h-3 bg-gray-900 border-r border-b border-gray-600 transform rotate-45"
            style={{
              left: '50%',
              marginLeft: '-6px',
              ...(tooltipPosition.y < position.y 
                ? { bottom: '-6px' } // Arrow pointing up when tooltip is above
                : { top: '-6px' }    // Arrow pointing down when tooltip is below
              )
            }}
          />
        </div>
      </div>
    </>
  );
}

// Enhanced tooltip with different types
export function GitTooltip({ show, content, position, type = 'info' }) {
  const typeStyles = {
    info: 'bg-blue-900 border-blue-600',
    success: 'bg-green-900 border-green-600', 
    warning: 'bg-yellow-900 border-yellow-600',
    error: 'bg-red-900 border-red-600',
    command: 'bg-gray-900 border-gray-600'
  };

  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    command: '⌨️'
  };

  if (!show || !content) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 60}px`,
      }}
    >
      <div className={`${typeStyles[type]} rounded-lg shadow-2xl p-3 max-w-xs`}>
        <div className="flex items-start space-x-2">
          <span className="text-lg">{typeIcons[type]}</span>
          <div className="text-white text-sm">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple tooltip for quick help
export function QuickTooltip({ children, content, position = 'top' }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded border border-gray-600 whitespace-nowrap ${
          position === 'top' ? 'bottom-full mb-1' : 
          position === 'bottom' ? 'top-full mt-1' :
          position === 'left' ? 'right-full mr-1' : 
          'left-full ml-1'
        }`}>
          {content}
        </div>
      )}
    </div>
  );
}