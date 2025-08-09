'use client';
import { useState, useEffect } from 'react';
import { Menu, X, RotateCcw, BookOpen, Monitor } from 'lucide-react';

export default function DrawerSidebar({ scenes, currentScene, onSceneSelect, onRestart }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when drawer is open
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

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleSceneClick = (sceneId) => {
    onSceneSelect(parseInt(sceneId));
    setIsOpen(false); // Close drawer after selection
  };

  const handleRestart = () => {
    onRestart();
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleDrawer}
        className="fixed top-4 left-4 z-50 p-2 bg-background border rounded-md hover:bg-accent transition-colors shadow-sm"
        aria-label="Open scene navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
          onWheel={(e) => e.preventDefault()} // Prevent scroll on backdrop
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scene Navigation</h2>
            <button
              onClick={toggleDrawer}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Jump to any scene in the tutorial</p>
        </div>

        {/* Restart Button */}
        <div className="flex-shrink-0 p-4 border-b">
          <button
            onClick={handleRestart}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Tutorial
          </button>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Tutorial Scenes
            </h3>
            <div className="space-y-2">
              {Object.entries(scenes).map(([sceneId, scene]) => {
                const isCurrentScene = parseInt(sceneId) === currentScene;
                const sceneNumber = parseInt(sceneId) + 1;
                
                return (
                  <button
                    key={sceneId}
                    onClick={() => handleSceneClick(sceneId)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-colors border
                      ${isCurrentScene 
                        ? 'bg-primary text-primary-foreground border-primary/20' 
                        : 'bg-card border-border hover:bg-accent/50'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                        ${isCurrentScene ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        {sceneNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {scene.title}
                        </div>
                        <div className="text-xs mt-1 flex items-center space-x-2">
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
                            <span className={`text-xs font-medium ${
                              isCurrentScene ? 'text-primary-foreground/70' : 'text-muted-foreground'
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
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Complete terminal scenes by typing the correct commands</p>
            <p>or use this menu to jump around</p>
          </div>
        </div>
      </div>
    </>
  );
}