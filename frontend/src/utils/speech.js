/**
 * Web Speech API & Multilingual Audio Utilities for GramNiti AI
 * Supports Speech-to-Text (STT) and Text-to-Speech (TTS)
 * for all 13 Indian Languages:
 * English (en), Hindi (hi), Marathi (mr), Bengali (bn), Gujarati (gu),
 * Punjabi (pa), Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml),
 * Odia (or), Assamese (as), and Urdu (ur).
 */

export const SPEECH_LANG_MAP = {
  en: ['en-IN', 'en-US', 'en-GB'],
  hi: ['hi-IN', 'hi'],
  mr: ['mr-IN', 'mr'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  gu: ['gu-IN', 'gu'],
  pa: ['pa-IN', 'pa-PK', 'pa'],
  ta: ['ta-IN', 'ta-LK', 'ta-SG', 'ta'],
  te: ['te-IN', 'te'],
  kn: ['kn-IN', 'kn'],
  ml: ['ml-IN', 'ml'],
  or: ['or-IN', 'od-IN', 'or', 'hi-IN'],
  as: ['as-IN', 'as', 'bn-IN', 'hi-IN'],
  ur: ['ur-IN', 'ur-PK', 'ur']
};

// Language code for TTS audio streaming fallback
export const TTS_AUDIO_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi',
  mr: 'mr',
  bn: 'bn',
  gu: 'gu',
  pa: 'pa',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  ml: 'ml',
  or: 'hi', // Fallback to Hindi phonetics if Odia is unavailable in cloud TTS
  as: 'bn', // Fallback to Bengali phonetics if Assamese is unavailable in cloud TTS
  ur: 'ur'
};

// Global active audio element tracker to prevent overlapping audio
let activeAudioElement = null;
let cachedVoices = [];

// Preload and cache browser voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoices = window.speechSynthesis.getVoices() || [];
  window.speechSynthesis.onvoiceschanged = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      console.warn("Could not cache voices", e);
    }
  };
}

export const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }
  return new SpeechRecognition();
};

export const startListening = ({
  language = 'en',
  onResult,
  onError,
  onEnd
}) => {
  const recognition = getSpeechRecognition();
  if (!recognition) {
    if (onError) onError(new Error("Speech recognition is not supported in this browser."));
    return null;
  }

  const langCodes = SPEECH_LANG_MAP[language] || ['en-IN'];
  recognition.lang = langCodes[0];
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Speech recognition error:", event?.error);
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.warn("Failed to start speech recognition:", err);
    if (onError) onError(err);
    return null;
  }
};

/**
 * Clean text for natural speech synthesis
 */
const cleanSpeechText = (text) => {
  if (!text) return '';
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
    .replace(/[#*_`~[\]()|🌾🐄💰⚠️•\-—]/g, ' ') // Strip markdown/bullet decorations
    .replace(/https?:\/\/\S+/g, '') // Strip raw URLs
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Universal Multilingual Speak Text function
 * Automatically chooses best available method:
 * 1. Native browser SpeechSynthesis voice if available on user's device
 * 2. High-quality cloud TTS audio stream fallback for authentic regional Indian pronunciation
 */
export const speakText = (text, language = 'en', onEndCallback = null) => {
  if (typeof window === 'undefined' || !text) return;

  // Stop any ongoing speech or audio
  stopSpeaking();

  const cleanText = cleanSpeechText(text);
  if (!cleanText) return;

  const candidateLangs = SPEECH_LANG_MAP[language] || ['en-IN', 'en-US'];
  const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis?.getVoices() || []);

  // Look for a native browser voice that matches language code
  let matchedVoice = null;
  if (voices && voices.length > 0) {
    for (const targetLang of candidateLangs) {
      const targetPrefix = targetLang.split('-')[0].toLowerCase();
      matchedVoice = voices.find(v => {
        const vLang = (v.lang || '').toLowerCase().replace('_', '-');
        return vLang === targetLang.toLowerCase() || vLang.startsWith(targetPrefix);
      });
      if (matchedVoice) break;
    }
  }

  // If native voice found in browser, use Web Speech API
  if (matchedVoice && window.speechSynthesis) {
    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang || candidateLangs[0];
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (onEndCallback) {
        utterance.onend = onEndCallback;
        utterance.onerror = onEndCallback;
      }

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn("SpeechSynthesis error, falling back to audio stream:", e);
    }
  }

  // If no native browser voice exists for regional language, use online TTS stream fallback
  const streamLang = TTS_AUDIO_LANG_MAP[language] || 'en';
  // Split long text into max 180 char chunks for smooth cloud TTS streaming
  const maxChunkLength = 180;
  const chunks = [];
  const sentences = cleanText.split(/([।?!.\n]+)/).filter(Boolean);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  if (chunks.length === 0) chunks.push(cleanText.slice(0, maxChunkLength));

  let currentChunkIndex = 0;

  const playNextChunk = () => {
    if (currentChunkIndex >= chunks.length) {
      activeAudioElement = null;
      if (onEndCallback) onEndCallback();
      return;
    }

    const chunk = chunks[currentChunkIndex];
    currentChunkIndex++;
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(streamLang)}&q=${encodeURIComponent(chunk)}`;

    const audio = new Audio(ttsUrl);
    activeAudioElement = audio;

    audio.onended = () => {
      playNextChunk();
    };

    audio.onerror = () => {
      // If audio streaming fails (e.g. offline), fallback to basic SpeechSynthesis
      if (window.speechSynthesis) {
        try {
          const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
          fallbackUtterance.lang = candidateLangs[0];
          if (onEndCallback) fallbackUtterance.onend = onEndCallback;
          window.speechSynthesis.speak(fallbackUtterance);
        } catch (err) {
          console.warn("Speech synthesis fallback failed:", err);
          if (onEndCallback) onEndCallback();
        }
      } else if (onEndCallback) {
        onEndCallback();
      }
    };

    audio.play().catch((playErr) => {
      console.warn("Audio playback notice:", playErr);
      // Try SpeechSynthesis fallback if autoplay was restricted
      if (window.speechSynthesis) {
        try {
          const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
          fallbackUtterance.lang = candidateLangs[0];
          if (onEndCallback) fallbackUtterance.onend = onEndCallback;
          window.speechSynthesis.speak(fallbackUtterance);
        } catch (err) {
          if (onEndCallback) onEndCallback();
        }
      }
    });
  };

  playNextChunk();
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined') {
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
        activeAudioElement = null;
      } catch (e) {
        // ignore
      }
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  }
};

