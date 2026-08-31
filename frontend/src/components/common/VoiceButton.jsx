import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Mic, Volume2, MicOff } from 'lucide-react';

export const VoiceButton = ({ onTranscript, readText, className = "" }) => {
  const { listen, speak, isListening, isSpeaking, language, currentLanguageMeta } = useLanguage();

  const handleMicClick = () => {
    listen((transcript) => {
      if (onTranscript) onTranscript(transcript);
    });
  };

  const handleReadClick = () => {
    if (readText) {
      speak(readText);
    }
  };

  const langDisplayName = currentLanguageMeta?.name || 'English';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {onTranscript && (
        <button
          type="button"
          onClick={handleMicClick}
          className={`p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white animate-pulse border-red-600 shadow-md ring-2 ring-red-300'
              : 'bg-rural-green-100 text-rural-green-900 border-rural-green-300 hover:bg-rural-green-200'
          }`}
          title={`Speak question in ${langDisplayName}`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rural-green-800" />}
        </button>
      )}

      {readText && (
        <button
          type="button"
          onClick={handleReadClick}
          className={`p-2 rounded-full border transition-all flex items-center justify-center ${
            isSpeaking
              ? 'bg-rural-saffron-500 text-white animate-bounce border-rural-saffron-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-cream-200'
          }`}
          title="Read aloud"
        >
          <Volume2 className="w-4 h-4 text-rural-green-800" />
        </button>
      )}
    </div>
  );
};
