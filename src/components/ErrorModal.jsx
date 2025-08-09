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
      className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4"
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
        className="bg-background border rounded-lg p-6 max-w-lg w-full mx-4 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Command Error</h3>
              <p className="text-sm text-muted-foreground">You typed the wrong Git command</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-accent rounded-md flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Message */}
        <div className="bg-destructive/5 border-l-4 border-destructive p-4 mb-6 rounded-r-md">
          <p className="text-sm leading-relaxed">
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
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}