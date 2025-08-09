'use client';
import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import tutorialData from '@/data/git-tutorial-data.json';
import DrawerSidebar from '@/components/DrawerSidebar';
import ErrorModal from '@/components/ErrorModal';

export default function MainPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeTab, setActiveTab] = useState('story'); // 'story' or 'terminal'

  const scenes = tutorialData.tutorial.scenes;
  const currentSceneData = scenes[currentScene.toString()];

  // Scene transition with animation
  const goToScene = (sceneId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(sceneId);
      setIsTransitioning(false);
      // Auto-switch to story tab when scene changes
      setActiveTab('story');
    }, 300);
  };

  // Handle narrative scene choices
  const handleChoice = (choice) => {
    if (choice.knowledge) {
      setKnowledgeLevel(prev => prev + choice.knowledge);
    }
    goToScene(choice.next);
  };

  // Handle terminal command execution
  const handleTerminalCommand = (command) => {
    if (command === currentSceneData.correctCommand) {
      goToScene(currentSceneData.nextSceneOnSuccess);
    }
    // If wrong command, stay on current scene - ErrorModal will be shown by handleTerminalError
  };

  // Handle terminal error
  const handleTerminalError = () => {
    setErrorMessage(currentSceneData.errorMessage);
    setShowErrorModal(true);
  };

  // Close error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  // Progress calculation
  const totalScenes = Object.keys(scenes).length;
  const progress = ((currentScene + 1) / totalScenes) * 100;

  // Restart tutorial
  const restartTutorial = () => {
    setCurrentScene(0);
    setKnowledgeLevel(0);
    setActiveTab('story');
  };

  if (!currentSceneData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tutorial Complete!</h1>
          <button 
            onClick={restartTutorial}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header with progress */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Git Happens</h1>
            <p>A TechnoSphere Solutions Training Nightmare</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-400">Knowledge:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                knowledgeLevel >= 8 ? 'bg-green-600' : 
                knowledgeLevel >= 5 ? 'bg-yellow-600' : 
                'bg-red-600'
              }`}>
                {knowledgeLevel}/10
              </span>
            </div>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-400">
              {currentScene + 1}/{totalScenes}
            </span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto p-6 h-[calc(100vh-120px)]">
        <div className={`h-full transition-all duration-300 ${
          isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          
          {/* Narrative Scene */}
          {currentSceneData.type === 'narrative' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 h-full flex flex-col">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 text-blue-300">
                  {currentSceneData.title}
                </h2>
                <div className="prose prose-invert prose-lg max-w-none mb-6">
                  <p className="whitespace-pre-line text-gray-200 leading-relaxed">
                    {currentSceneData.content}
                  </p>
                </div>
              </div>

              <div className="space-y-3 flex-shrink-0">
                {currentSceneData.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="block w-full text-left p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    <span className="font-medium">{choice.text}</span>
                    {choice.knowledge && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        choice.knowledge > 0 ? 'bg-green-500/30' : 'bg-red-500/30'
                      }`}>
                        {choice.knowledge > 0 ? '+' : ''}{choice.knowledge} knowledge
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Terminal Scene with Tabs */}
          {currentSceneData.type === 'terminal' && (
            <div className="h-full flex flex-col">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'story'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  📖 Story
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'terminal'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  💻 Terminal
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {/* Story Tab */}
                {activeTab === 'story' && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <h2 className="text-3xl font-bold mb-4 text-green-400">
                        {currentSceneData.title}
                      </h2>
                      <div className="prose prose-invert prose-lg max-w-none">
                        <p className="whitespace-pre-line text-gray-200 leading-relaxed">
                          {currentSceneData.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 mt-6 pt-6 border-t border-gray-600">
                      <button
                        onClick={() => setActiveTab('terminal')}
                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Continue to Terminal →
                      </button>
                    </div>
                  </div>
                )}

                {/* Terminal Tab */}
                {activeTab === 'terminal' && (
                  <div className="h-full flex flex-col space-y-6">
                    {/* Command - Above Terminal */}
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600 flex-shrink-0">
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Command:</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 rounded-lg border border-gray-600 bg-gray-900/50">
                          <div className="text-green-400 font-mono text-sm">
                            $ {currentSceneData.correctCommand}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        💡 Type this command in the terminal below to continue
                      </p>
                    </div>

                    {/* Terminal component */}
                    <div className="flex-1 min-h-0">
                      <Terminal
                        prompt={currentSceneData.prompt}
                        choices={currentSceneData.choices}
                        correctCommand={currentSceneData.correctCommand}
                        onCommand={handleTerminalCommand}
                        onError={handleTerminalError}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sidebar */}
        <DrawerSidebar
          scenes={scenes}
          currentScene={currentScene}
          onSceneSelect={goToScene}
          onRestart={restartTutorial}
        />

        {/* Global Error Modal */}
        <ErrorModal
          show={showErrorModal}
          errorMessage={errorMessage}
          onClose={closeErrorModal}
        />
      </main>
    </div>
  );
}