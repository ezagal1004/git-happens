'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Upload, Plus, Trash2 } from 'lucide-react';

export default function TranscribeTool() {
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioFile, setAudioFile] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [fullText, setFullText] = useState('');
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioFile]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioFile(url);
      setTimestamps([]);
      setCurrentTime(0);
      
      // Clean up previous URL
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !audioFile) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.pause();
    }
  };

  const markTimestamp = () => {
    let textToUse = '';
    
    if (selectedWordIndex !== null && fullText) {
      // Use selected word from pasted text
      const words = fullText.split(/\s+/);
      textToUse = words[selectedWordIndex] || '';
    } else if (currentText.trim()) {
      // Use manually typed text
      textToUse = currentText.trim();
    } else {
      return; // No text to mark
    }
    
    const newTimestamp = {
      id: Date.now(),
      time: parseFloat(currentTime.toFixed(2)),
      text: textToUse,
      wordIndex: selectedWordIndex
    };
    
    setTimestamps(prev => [...prev, newTimestamp].sort((a, b) => a.time - b.time));
    setCurrentText('');
    setSelectedWordIndex(null);
  };

  const selectWord = (wordIndex) => {
    setSelectedWordIndex(wordIndex);
    setCurrentText(''); // Clear manual input when selecting from text
  };

  const removeTimestamp = (id) => {
    setTimestamps(prev => prev.filter(ts => ts.id !== id));
  };

  const generateJSON = () => {
    const timingArray = timestamps.map(ts => ({
      start: ts.time,
      text: ts.text
    }));
    
    return JSON.stringify(timingArray, null, 2);
  };

  const downloadJSON = () => {
    const jsonData = generateJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio-timestamps.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const jumpToTime = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Audio Transcription Tool</h1>
          <p className="text-gray-400">Upload audio, mark timestamps, and generate timing JSON</p>
        </div>

        {/* File Upload */}
        <div className="bg-gray-950 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors"
            >
              <Upload size={20} />
              Upload Audio File
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="bg-gray-950 rounded-lg border border-gray-700 p-6">
          <h3 className="text-orange-400 font-bold text-xl mb-4">Paste Your Text (Optional)</h3>
          <textarea
            value={fullText}
            onChange={(e) => setFullText(e.target.value)}
            placeholder="Paste the full transcript here. You'll be able to click on words to mark timestamps..."
            className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-400 resize-none"
          />
          
          {fullText && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Click on words to select them for timestamp marking:</div>
              <div className="text-gray-300 leading-relaxed">
                {fullText.split(/\s+/).map((word, index) => {
                  const isSelected = selectedWordIndex === index;
                  const hasTimestamp = timestamps.some(ts => ts.wordIndex === index);
                  
                  return (
                    <span
                      key={index}
                      onClick={() => selectWord(index)}
                      className={`cursor-pointer px-1 py-0.5 rounded transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : hasTimestamp
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                <span className="inline-block w-3 h-3 bg-orange-500 rounded mr-1"></span>Selected
                <span className="inline-block w-3 h-3 bg-green-600 rounded mr-1 ml-4"></span>Has Timestamp
              </div>
            </div>
          )}
        </div>

        {audioFile && (
          <>
            {/* Audio Player */}
            <div className="bg-gray-950 rounded-lg border border-gray-700 p-6">
              <audio ref={audioRef} src={audioFile} preload="metadata" />
              
              <div className="space-y-4">
                {/* Time Display */}
                <div className="text-center">
                  <div className="text-2xl font-mono text-orange-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-400 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={resetAudio}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                  
                  <button
                    onClick={togglePlayback}
                    className="p-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Timestamp Marking */}
            <div className="bg-gray-950 rounded-lg border border-gray-700 p-6">
              <h3 className="text-orange-400 font-bold text-xl mb-4">Mark Timestamp</h3>
              
              <div className="space-y-4">
                {selectedWordIndex !== null && fullText && (
                  <div className="p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
                    <div className="text-blue-400 text-sm">Selected word:</div>
                    <div className="text-white font-medium">"{fullText.split(/\s+/)[selectedWordIndex]}"</div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={currentText}
                    onChange={(e) => {
                      setCurrentText(e.target.value);
                      if (e.target.value.trim()) setSelectedWordIndex(null); // Clear selection when typing
                    }}
                    placeholder="Or manually enter text for this timestamp..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-400"
                    onKeyPress={(e) => e.key === 'Enter' && markTimestamp()}
                  />
                  
                  <button
                    onClick={markTimestamp}
                    disabled={!currentText.trim() && selectedWordIndex === null}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Mark at {formatTime(currentTime)}
                  </button>
                </div>
              </div>
            </div>

            {/* Timestamps List */}
            {timestamps.length > 0 && (
              <div className="bg-gray-950 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-400 font-bold text-xl">Timestamps ({timestamps.length})</h3>
                  <button
                    onClick={downloadJSON}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download JSON
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timestamps.map((ts) => (
                    <div key={ts.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                      <button
                        onClick={() => jumpToTime(ts.time)}
                        className="text-orange-400 font-mono text-sm hover:text-orange-300 transition-colors"
                      >
                        {formatTime(ts.time)}
                      </button>
                      
                      <span className="flex-1 text-gray-300">{ts.text}</span>
                      
                      <button
                        onClick={() => removeTimestamp(ts.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JSON Preview */}
            {timestamps.length > 0 && (
              <div className="bg-gray-950 rounded-lg border border-gray-700 p-6">
                <h3 className="text-orange-400 font-bold text-xl mb-4">Generated JSON</h3>
                <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                  {generateJSON()}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}