'use client';
import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

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
      className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-hidden"
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
        className="bg-background border rounded-lg p-4 sm:p-6 max-w-lg w-full mx-2 sm:mx-4 shadow-lg min-w-0 max-h-[90vh] overflow-y-auto overscroll-contain"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3 min-w-0">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold break-words">Command Error</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words overflow-wrap-anywhere">
                You typed the wrong Git command
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md flex-shrink-0 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close error modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Message */}
        <div className="bg-destructive/5 border-l-4 border-destructive p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-md overflow-hidden">
          <p className="text-sm leading-relaxed break-words overflow-wrap-anywhere">
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
            className="px-4 py-2 sm:py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base touch-manipulation min-h-[44px]"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}