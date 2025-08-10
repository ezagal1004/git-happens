'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Monitor, RotateCcw, ChevronRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('story');

  const scenes = tutorialData.tutorial.scenes;
  const currentSceneData = scenes[currentScene.toString()];

  const goToScene = (sceneId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(sceneId);
      setIsTransitioning(false);
      setActiveTab('story');
    }, 300);
  };

  const handleChoice = (choice) => {
    if (choice.knowledge) {
      setKnowledgeLevel(prev => prev + choice.knowledge);
    }
    goToScene(choice.next);
  };

  const handleTerminalCommand = (command) => {
    if (command === currentSceneData.correctCommand) {
      goToScene(currentSceneData.nextSceneOnSuccess);
    }
  };

  const handleTerminalError = () => {
    setErrorMessage(currentSceneData.errorMessage);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const totalScenes = Object.keys(scenes).length;
  const progress = ((currentScene + 1) / totalScenes) * 100;

  const restartTutorial = () => {
    setCurrentScene(0);
    setKnowledgeLevel(0);
    setActiveTab('story');
  };

  if (!currentSceneData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Tutorial Complete</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Congratulations on completing the Git tutorial!
            </p>
          </div>
          <button 
            onClick={restartTutorial}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-full">
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* DrawerSidebar Toggle */}
              <div className="flex-shrink-0">
                <DrawerSidebar
                  scenes={scenes}
                  currentScene={currentScene}
                  onSceneSelect={goToScene}
                  onRestart={restartTutorial}
                />
              </div>
              
              <div className="space-y-1 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold truncate">Git Happens</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">Interactive Git Tutorial</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Knowledge Level */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground hidden sm:inline">Knowledge</span>
                <div className={`px-1.5 sm:px-2 py-1 rounded-md text-xs font-medium ${
                  knowledgeLevel >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  knowledgeLevel >= 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {knowledgeLevel}/10
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-16 sm:w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                  {currentScene + 1}/{totalScenes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl min-w-0">
        <div className={`transition-all duration-300 ease-in-out min-w-0 ${
          isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}>
          
          {/* Narrative Scene */}
          {currentSceneData.type === 'narrative' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  {currentSceneData.title}
                </h2>
                <div className="prose prose-neutral dark:prose-invert prose-sm sm:prose-base max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base break-words overflow-wrap-anywhere">
                    {currentSceneData.content}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {currentSceneData.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="group w-full flex items-center justify-between p-3 sm:p-4 text-left bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm min-w-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-2 overflow-hidden">
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base break-words overflow-wrap-anywhere">
                        {choice.text}
                      </span>
                      {choice.knowledge && (
                        <span className={`text-xs px-1.5 sm:px-2 py-1 rounded-md font-medium flex-shrink-0 ${
                          choice.knowledge > 0 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {choice.knowledge > 0 ? '+' : ''}{choice.knowledge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Terminal Scene with Tabs */}
          {currentSceneData.type === 'terminal' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Tab Navigation */}
              <div className="inline-flex w-full sm:w-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm border">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`relative inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                    activeTab === 'story'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Story</span>
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`relative inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                    activeTab === 'terminal'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Terminal</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px] sm:min-h-[400px] relative">
                {/* Story Tab */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  activeTab === 'story' 
                    ? 'opacity-100 translate-x-0 pointer-events-auto' 
                    : 'opacity-0 translate-x-4 pointer-events-none'
                }`}>
                  <div className="space-y-4 sm:space-y-6 h-full">
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                        {currentSceneData.title}
                      </h2>
                      <div className="prose prose-neutral dark:prose-invert prose-sm sm:prose-base max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base break-words overflow-wrap-anywhere">
                          {currentSceneData.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-3 sm:pt-4 border-t">
                      <button
                        onClick={() => setActiveTab('terminal')}
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 shadow-sm font-medium text-sm sm:text-base"
                      >
                        Continue to Terminal
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terminal Tab */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  activeTab === 'terminal' 
                    ? 'opacity-100 translate-x-0 pointer-events-auto' 
                    : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}>
                  <div className="space-y-4 sm:space-y-6 h-full">
                    {/* Command Instructions */}
                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Command Required</h3>
                      <div className="space-y-2">
                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md font-mono text-xs sm:text-sm shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                          <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">$ </span>
                          <span className="text-green-600 dark:text-green-400 whitespace-nowrap">
                            {currentSceneData.correctCommand}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Type this command in the terminal below to continue
                        </p>
                      </div>
                    </div>

                    {/* Terminal Component */}
                    <div className="min-h-[150px] sm:min-h-[200px]">
                      <Terminal
                        prompt={currentSceneData.prompt}
                        choices={currentSceneData.choices}
                        correctCommand={currentSceneData.correctCommand}
                        onCommand={handleTerminalCommand}
                        onError={handleTerminalError}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ErrorModal
          show={showErrorModal}
          errorMessage={errorMessage}
          onClose={closeErrorModal}
        />
      </main>
    </div>
  );
}