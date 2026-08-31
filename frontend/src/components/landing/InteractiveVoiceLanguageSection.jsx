import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Volume2, VolumeX, Sparkles, Check, ArrowRight } from 'lucide-react';

export const InteractiveVoiceLanguageSection = () => {
  const { 
    language, 
    setLanguage, 
    supportedLanguages, 
    speak, 
    stopAudio, 
    isSpeaking,
    setShowOnboardingModal
  } = useLanguage();

  const voiceDemos = {
    hi: "नमस्ते! ग्रामनीती एआई में आपका स्वागत है। हम ग्रामीण उद्यमों के लिए सही सरकारी योजना और आर्थिक सहायता खोजने में आपकी मदद करते हैं।",
    mr: "नमस्कार! ग्रामनीती एआय मध्ये आपले स्वागत आहे. आम्ही ग्रामीण उद्योगांसाठी योग्य सरकारी योजना आणि कर्ज नियोजन मिळवून देतो.",
    bn: "নমস্কার! গ্রামনীতি এআই-তে আপনাকে স্বাগতম। আমরা গ্রামীণ উদ্যোগের জন্য সঠিক সরকারি প্রকল্প খুঁজে পেতে সহায়তা করি।",
    gu: "નમસ્તે! ગ્રામનીતિ AI માં આપનું સ્વાગત છે. અમે ગ્રામીણ વ્યવસાયો માટે યોગ્ય સરકારી યોજના શોધવામાં મદદ કરીએ છીએ.",
    pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਗ੍ਰਾਮਨੀਤੀ AI ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਅਸੀਂ ਪੇਂਡੂ ਕਾਰੋਬਾਰਾਂ ਲਈ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਾਂ।",
    ta: "வணக்கம்! கிராம்நீதி AI-க்கு நல்வரவு. கிராமப்புற தொழில்களுக்கான சரியான அரசு திட்டங்களை கண்டறிய நாங்கள் உதவுகிறோம்.",
    te: "నమస్కారం! గ్రామనీతి AI కి స్వాగతం. గ్రామీణ వ్యాపారాల కోసం సరైన ప్రభుత్వ పథకాలను ఎంచుకోవడంలో మేము సహాయం చేస్తాము.",
    kn: "ನಮಸ್ಕಾರ! ಗ್ರಾಮನೀತಿಗೆ ಸುಸ್ವಾಗತ. ಗ್ರಾಮೀಣ ಉದ್ಯಮಗಳಿಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ನಾವು ನೆರವಾಗುತ್ತೇವೆ.",
    ml: "നമസ്കാരം! ഗ്രാംനീതി AI-ലേക്ക് സ്വാഗതം. ഗ്രാമീണ സംരംഭങ്ങൾക്കായി മികച്ച സർക്കാർ പദ്ധതികൾ ഞങ്ങൾ കണ്ടെത്തുന്നു.",
    or: "ନମସ୍କାର! ଗ୍ରାମନୀତି AI ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଗ୍ରାମୀଣ ବ୍ୟବସାୟ ପାଇଁ ସଠିକ୍ ସରକାରୀ ଯୋଜନା ଖୋଜିବାରେ ଆମେ ସାହାଯ୍ୟ କରୁ।",
    as: "নমস্কাৰ! গ্ৰামনীতি AI লৈ আপোনাক স্বাগতম। আমি গ্ৰাম্য ব্যৱসায়ৰ বাবে উপযুক্ত চৰকাৰী আঁচনি বিচাৰি দিয়াত সহায় কৰোঁ।",
    ur: "سلام! گرام نیتی میں خوش آمدید۔ ہم دیہی کاروبار کے لیے صحیح سرکاری اسکیمیں تلاش کرنے میں مدد کرتے ہیں۔",
    en: "Welcome to GramNiti AI. Your intelligent decision-support assistant for rural enterprises and verified government subsidies."
  };

  const handleTestVoice = (langCode) => {
    setLanguage(langCode);
    const demoText = voiceDemos[langCode] || voiceDemos['en'];
    speak(demoText);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold uppercase tracking-wider font-mono">
            <Globe className="w-3.5 h-3.5 text-purple-700" />
            <span>Inclusive GovTech Innovation</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
            13 Official Indian Languages with Real-Time Voice Assistance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            GramNiti AI breaks through language barriers by providing natural, conversational speech and text guidance in your mother tongue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowOnboardingModal(true)}
          className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer"
        >
          <span>Language Preferences</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 13 Language Interactive Audio Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {supportedLanguages.map((langItem) => {
          const isCurrent = language === langItem.code;
          return (
            <button
              key={langItem.code}
              type="button"
              onClick={() => handleTestVoice(langItem.code)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                isCurrent
                  ? 'bg-purple-900 text-white border-purple-900 shadow-md ring-2 ring-purple-400/50'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                <span className={isCurrent ? 'text-purple-200' : 'text-slate-400'}>
                  {langItem.badge}
                </span>
                <Volume2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-300' : 'text-slate-400 group-hover:text-purple-600'}`} />
              </div>
              <div className="font-bold text-sm font-sans truncate">
                {langItem.nativeName}
              </div>
              <div className={`text-[10px] truncate ${isCurrent ? 'text-purple-200' : 'text-slate-500'}`}>
                {langItem.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Voice Status Banner */}
      <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-950 font-medium">
          <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
          <span>
            Active Language: <strong>{supportedLanguages.find(l => l.code === language)?.nativeName || 'English'}</strong>. Click any language above to switch and hear instant voice synthesis!
          </span>
        </div>

        {isSpeaking && (
          <button
            type="button"
            onClick={stopAudio}
            className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer animate-pulse"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Stop Speaking</span>
          </button>
        )}
      </div>

    </section>
  );
};
