import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { VoiceButton } from '../components/common/VoiceButton';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  Mic, 
  Volume2, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  User, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const ChatPage = () => {
  const { language, currentLanguageMeta, t, speak, detectLanguage } = useLanguage();
  const { userProfile, currentLocation, selectedBusiness, selectedScheme } = useGramNiti();

  const getInitialMessage = () => {
    const welcomeMap = {
      mr: "🌾 **नमस्कार! मी ग्रामनीती AI सहाय्यक आहे.**\n\nमी तुम्हाला योग्य व्यवसाय निवडणे, सरकारी योजनांची सत्यता तपासणे (Fraud Detection), EMI व नफा सिम्युलेशन, आणि बँक DPR अहवाल तयार करण्यात मदत करू शकतो.\n\nतुम्हाला काय जाणून घ्यायचे आहे?",
      hi: "🌾 **नमस्ते! मैं ग्रामनीती एआई सहायक हूँ।**\n\nमैं आपको सही व्यवसाय चुनने, सरकारी योजनाओं का सत्यापन करने (फ्रॉड डिटेक्शन), EMI व लाभ सिमुलेशन, और बैंक डीपीआर रिपोर्ट तैयार करने में सहायता कर सकता हूँ।\n\nआप क्या जानना चाहते हैं?",
      bn: "🌾 **নমস্কার! আমি আপনার গ্রামনীতি AI সহকারী।**\n\nগ্রামীণ ব্যবসা, সরকারি অনুদান, প্রকল্প বা প্রতারণা যাচাই সম্পর্কে যেকোনো প্রশ্ন করুন।\n\nআপনি কী জানতে চান?",
      gu: "🌾 **નમસ્તે! હું તમારો ગ્રામનીતિ AI સહાયક છું।**\n\nગ્રામીણ વ્યવસાય, સરકારી યોજનાઓ, સબસિડી અથવા છેતરપિંડી ચકાસણી વિશે કંઈપણ પૂછો.\n\nતમે શું જાણવા માંગો છો?",
      pa: "🌾 **ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਗ੍ਰਾਮਨੀਤੀ AI ਸਹਾਇਕ ਹਾਂ।**\n\nਪੇਂਡੂ ਕਾਰੋਬਾਰ, ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਸਬਸਿਡੀ ਜਾਂ ਠੱਗੀ ਪੜਤਾਲ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।\n\nਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
      ta: "🌾 **வணக்கம்! நான் உங்கள் கிராம்நீதி AI உதவியாளர்.**\n\nகிராமப்புற தொழில்கள், அரசு மானியங்கள், திட்டங்கள் அல்லது மோசடி சரிபார்ப்பு பற்றி எதையும் கேளுங்கள்.\n\nநான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
      te: "🌾 **నమస్కారం! నేను మీ గ్రామనీతి AI సహాయకుడిని.**\n\nగ్రామీణ వ్యాపారాలు, ప్రభుత్వ సబ్సిడీలు, పథకాలు లేదా మోసాల ధృవీకరణ గురించి ఏదైనా అడగండి.\n\nనేను మీకు ఎలా సహాయపడగలను?",
      kn: "🌾 **ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಗ್ರಾಮನೀತಿ AI ಸಹಾಯಕ.**\n\nಗ್ರಾಮೀಣ ಉದ್ಯಮಗಳು, ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು, ಯೋಜನೆಗಳು ಅಥವಾ ವಂಚನೆ ಪರಿಶೀಲನೆಯ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ.\n\nನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
      ml: "🌾 **നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഗ്രാംനീതി AI സഹായിയാണ്.**\n\nഗ്രാമീണ സംരംഭങ്ങൾ, സർക്കാർ സബ്‌സിഡികൾ, പദ്ധതികൾ അല്ലെങ്കിൽ തട്ടിപ്പ് പരിശോധന എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കാം.\n\nഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?",
      or: "🌾 **ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର ଗ୍ରାମନୀତି AI ସହାୟକ।**\n\nଗ୍ରାମୀଣ ବ୍ୟବସାୟ, ସରକାରୀ ସବସିଡି, ଯୋଜନା କିମ୍ବା ଠକେଇ ଯାଞ୍ଚ ବିଷୟରେ ଯାହା କିଛି ପଚାରନ୍ତୁ।\n\nଆପଣ କ’ଣ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?",
      as: "🌾 **নমস্কাৰ! মই আপোনাৰ গ্ৰামনীতি AI সহায়ক।**\n\nগ্ৰামীণ ব্যৱসায়, চৰকাৰী ৰাজসাহায্য, আঁচনি বা প্ৰতাৰণা পৰীক্ষণ সম্পৰ্কে যিকোনো কথা সোধক।\n\nআপুনি কি জানিব বিচাৰে?",
      ur: "🌾 **سلام! میں آپ کا گرام نیتی AI معاون ہوں۔**\n\nدیہی کاروبار، سرکاری سبسڈی، اسکیموں یا فراڈ کی تصدیق کے بارے میں کچھ بھی پوچھیں۔\n\nمیں آپ کی کس طرح مدد کر سکتا ہوں؟"
    };

    const followupsMap = {
      mr: ["डेअरी व्यवसाय कसा सुरू करावा?", "सरकारी योजनांची सत्यता कशी तपासावी?", "PMEGP अनुदानाचे प्रमाण काय आहे?"],
      hi: ["डेयरी फार्मिंग कैसे शुरू करें?", "सरकारी योजनाओं का सत्यापन कैसे करें?", "PMEGP में महिलाओं को कितनी सब्सिडी मिलती है?"],
      bn: ["ডেইরি ব্যবসা কীভাবে শুরু করবেন?", "সরকারি প্রকল্পের সত্যতা কীভাবে যাচাই করবেন?", "PMEGP প্রকল্পে ভর্তুকির হার কত?"],
      gu: ["ડેરી ફાર્મિંગ કેવી રીતે શરૂ કરવું?", "સરકારી યોજનાઓની ચકાસણી કેવી રીતે કરવી?", "PMEGP માં કેટલી સબસિડી મળે છે?"],
      pa: ["ਡੇਅਰੀ ਕਾਰੋਬਾਰ ਕਿਵੇਂ ਸ਼ੁਰੂ ਕਰੀਏ?", "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਪੜਤਾਲ ਕਿਵੇਂ ਕਰੀਏ?", "PMEGP ਸਕੀਮ ਵਿੱਚ ਕਿੰਨੀ ਸਬਸਿਡੀ ਮਿਲਦੀ ਹੈ?"],
      ta: ["பால் பண்ணை தொழிலை தொடங்குவது எப்படி?", "அரசு திட்டங்களின் உண்மைத்தன்மையை அறிவது எப்படி?", "PMEGP திட்டத்தில் மானியம் எவ்வளவு?"],
      te: ["డైరీ ఫార్మింగ్ ఎలా ప్రారంభించాలి?", "ప్రభుత్వ పథకాల ప్రామాణికతను ఎలా తనిఖీ చేయాలి?", "PMEGP పథకంలో సబ్సిడీ ఎంత?"],
      kn: ["ಡೈರಿ ಉದ್ಯಮವನ್ನು ಹೇಗೆ ಪ್ರಾರಂಭಿಸುವುದು?", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?", "PMEGP ಸಬ್ಸಿಡಿ ದರ ಎಷ್ಟು?"],
      ml: ["ഡയറി ഫാം എങ്ങനെ ആരംഭിക്കാം?", "സർക്കാർ പദ്ധതികളുടെ സാധുത എങ്ങനെ പരിശോധിക്കാം?", "PMEGP സബ്‌സിഡി നിരക്ക് എത്രയാണ്?"],
      or: ["ଡାଏରୀ ବ୍ୟବସାୟ କିପରି ଆରମ୍ଭ କରିବେ?", "ସରକାରୀ ଯୋଜନାର ସତ୍ୟତା କିପରି ଯାଞ୍ଚ କରିବେ?", "PMEGP ଯୋଜନାରେ କେତେ ସବସିଡି ମିଳେ?"],
      as: ["দুগ্ধ ব্যৱসায় কেনেদৰে আৰম্ভ কৰিব?", "চৰকাৰী আঁচনিৰ সত্যতা কেনেদৰে পৰীক্ষা কৰিব?", "PMEGP আঁচনিত ৰাজসাহায্যৰ পৰিমাণ কিমান?"],
      ur: ["ڈیری فارمنگ کیسے شروع کریں؟", "سرکاری اسکیموں کی تصدیق کیسے کریں؟", "PMEGP اسکیم میں سبسڈی کی شرح کیا ہے?"]
    };

    return {
      sender: 'bot',
      text: welcomeMap[language] || "🌾 **Namaste! I am your GramNiti AI decision assistant.**\n\nI can help you discover rural businesses, verify government schemes & detect fraud, calculate EMI, simulate 3-scenario cash flows, and generate a bankable DPR.\n\nHow can I help you today?",
      citations: [
        {
          source_name: "KVIC PMEGP Portal",
          organization: "Ministry of MSME",
          official_portal_url: "https://www.kviconline.gov.in/",
          last_verified_at: "2026-08-01",
          verification_status: "OFFICIALLY_VERIFIED"
        }
      ],
      suggestedFollowups: followupsMap[language] || [
        "How to start Dairy Farming?",
        "Is paying advance fee for loan a scam?",
        "What is the PMEGP subsidy rate for women?"
      ]
    };
  };

  const [messages, setMessages] = useState([getInitialMessage()]);

  // Update initial message when language switches
  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [language]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText = inputQuery) => {
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    try {
      setLoading(true);
      const res = await api.askGramNiti(queryText, language, {
        userProfile,
        location: currentLocation,
        business: selectedBusiness,
        scheme: selectedScheme
      });

      const botMsg = {
        sender: 'bot',
        text: res.reply_text,
        citations: res.citations || [],
        suggestedFollowups: res.suggested_followups || []
      };

      setMessages(prev => [...prev, botMsg]);
      // Optional: automatically speak response if enabled
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "Something went wrong. Please check your connection and try again.",
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl">
            <Bot className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-gray-900 flex items-center gap-2">
              {t('card_chat_title')}
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-mono">
                RAG Verified Knowledge
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Multilingual speech & text assistant answering queries with official citations.
            </p>
          </div>
        </div>

        <div className="text-xs bg-cream-100 text-gray-700 px-3 py-1.5 rounded-xl border border-cream-300 font-mono hidden sm:block">
          Lang: {language.toUpperCase()}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-cream-300 shadow-sm min-h-[480px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-rural-green-800 text-white'
                  : 'bg-teal-700 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-rural-green-800 text-white rounded-tr-none'
                  : 'bg-cream-50 text-gray-900 border border-cream-300 rounded-tl-none shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line prose prose-xs max-w-none">
                {msg.text}
              </div>

              {/* Bot Citations Pills */}
              {msg.citations?.length > 0 && (
                <div className="pt-2 border-t border-cream-200 space-y-1">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Official Citations:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.official_portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] bg-white text-blue-700 hover:text-blue-900 px-2 py-0.5 rounded border border-blue-200 font-medium hover:underline"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        {c.source_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* TTS Read button for bot message */}
              {msg.sender === 'bot' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => speak(msg.text)}
                    className="text-[11px] text-gray-500 hover:text-rural-green-800 flex items-center gap-1 font-medium"
                    title="Read answer aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggestedFollowups?.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowups.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[10px] bg-white hover:bg-cream-100 text-rural-green-900 px-2 py-1 rounded-lg border border-rural-green-300 transition-colors font-medium text-left"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-cream-50 text-gray-500 rounded-2xl p-3 text-xs flex items-center gap-2 border border-cream-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Retrieving verified government scheme data...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar with Voice Mic */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white rounded-2xl p-2.5 border border-cream-300 shadow-sm flex items-center gap-2"
      >
        <VoiceButton
          onTranscript={(transcript) => {
            setInputQuery(transcript);
            handleSend(transcript);
          }}
        />

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`${t('chat_placeholder')} (${currentLanguageMeta?.nativeName || 'English'})`}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-gray-900 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="p-2.5 bg-rural-green-800 hover:bg-rural-green-700 text-white rounded-xl disabled:opacity-40 transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <DisclaimerBanner />
    </div>
  );
};
