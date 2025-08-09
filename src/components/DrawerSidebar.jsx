'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, RotateCcw, BookOpen, Monitor } from 'lucide-react';

export default function DrawerSidebar({ scenes, currentScene, onSceneSelect, onRestart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before creating portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSceneClick = (sceneId) => {
    onSceneSelect(parseInt(sceneId));
    setIsOpen(false); // Close modal after selection
  };

  const handleRestart = () => {
    onRestart();
    setIsOpen(false);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Content */}
      <div 
        className="bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform scale-100 transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Scene Navigation</h2>
              <p className="text-sm text-muted-foreground mt-1">Jump to any scene in the tutorial</p>
            </div>
            <button
              onClick={toggleModal}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Restart Button */}
        <div className="flex-shrink-0 p-6 border-b">
          <button
            onClick={handleRestart}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Restart Tutorial
          </button>
        </div>

        {/* Scene Grid */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Tutorial Scenes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(scenes).map(([sceneId, scene]) => {
              const isCurrentScene = parseInt(sceneId) === currentScene;
              const sceneNumber = parseInt(sceneId) + 1;
              
              return (
                <button
                  key={sceneId}
                  onClick={() => handleSceneClick(sceneId)}
                  className={`
                    text-left p-4 rounded-lg transition-all border group hover:scale-[1.02]
                    ${isCurrentScene 
                      ? 'bg-primary text-primary-foreground border-primary/20 shadow-lg' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCurrentScene ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                    `}>
                      {sceneNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm mb-2 line-clamp-2 ${
                        isCurrentScene ? 'text-primary-foreground' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {scene.title}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                          ${scene.type === 'terminal' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }
                        `}>
                          {scene.type === 'terminal' ? (
                            <>
                              <Monitor className="w-3 h-3" />
                              Terminal
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-3 h-3" />
                              Story
                            </>
                          )}
                        </div>
                        {isCurrentScene && (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            isCurrentScene ? 'bg-primary-foreground/20 text-primary-foreground' : 'text-muted-foreground'
                          }`}>
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Complete terminal scenes by typing the correct commands</p>
            <p>or use this menu to jump around the tutorial</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleModal}
        className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label="Open scene navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Portal Modal - Renders at document body level */}
      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}