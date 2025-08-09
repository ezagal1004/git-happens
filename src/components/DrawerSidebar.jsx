'use client';
import { useState, useEffect } from 'react';

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
        className="fixed top-4 left-4 z-50 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors shadow-lg"
        aria-label="Open scene navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
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
        fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Scene Navigation</h2>
            <button
              onClick={toggleDrawer}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">Jump to any scene in the tutorial</p>
        </div>

        {/* Restart Button */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700">
          <button
            onClick={handleRestart}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            🔄 Restart Tutorial
          </button>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
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
                      w-full text-left p-3 rounded-lg transition-all duration-200 border
                      ${isCurrentScene 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${isCurrentScene ? 'bg-blue-500' : 'bg-gray-700'}
                      `}>
                        {sceneNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {scene.title}
                        </div>
                        <div className={`
                          text-xs mt-1 flex items-center space-x-2
                          ${isCurrentScene ? 'text-blue-200' : 'text-gray-500'}
                        `}>
                          <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${scene.type === 'terminal' 
                              ? 'bg-green-900/50 text-green-300' 
                              : 'bg-purple-900/50 text-purple-300'
                            }
                          `}>
                            {scene.type === 'terminal' ? '💻 Terminal' : '📖 Story'}
                          </span>
                          {isCurrentScene && (
                            <span className="text-blue-300">← Current</span>
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
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            <p>💡 Complete terminal scenes by typing the correct commands</p>
            <p className="mt-1">or use this menu to jump around</p>
          </div>
        </div>
      </div>
    </>
  );
}