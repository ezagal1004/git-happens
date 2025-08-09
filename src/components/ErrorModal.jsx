'use client';
import { useEffect } from 'react';

export default function ErrorModal({ show, errorMessage, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show || !errorMessage) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onWheel={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {/* Modal Content */}
      <div 
        className="bg-gray-800 border-2 border-red-500 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl transform scale-100"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-white text-2xl">❌</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Command Error</h3>
              <p className="text-gray-400">You typed the wrong Git command</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        <div className="bg-gray-900 border-l-4 border-red-500 p-6 mb-6 rounded-r-lg">
          <p className="text-gray-100 text-lg leading-relaxed font-medium">
            {errorMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-lg"
          >
            I'll try again
          </button>
        </div>
      </div>
    </div>
  );
}