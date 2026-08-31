import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SLIDES_DATA } from './slidesData';
import { CarouselSlide } from './CarouselSlide';
import { CarouselControls } from './CarouselControls';
import { PaginationDots } from './PaginationDots';
import { useLanguage } from '../../contexts/LanguageContext';
import { Volume2, VolumeX, Sparkles, ArrowRight, Play, Pause } from 'lucide-react';

/**
 * HeroCarousel
 * Full-width automated slideshow utilizing all 5 designed landing page images.
 * Features 5-second auto-play, 700ms smooth horizontal slide/fade transition,
 * working interactive hitboxes on all illustrated buttons, pause on hover,
 * manual navigation timer reset, touch swipe gestures, keyboard accessibility,
 * and audio readout for all 13 Indian languages.
 */
export const HeroCarousel = ({ setActiveTab }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { language, speak, stopAudio, isSpeaking } = useLanguage();

  const totalSlides = SLIDES_DATA.length;
  const timerRef = useRef(null);
  const carouselContainerRef = useRef(null);

  // Minimum swipe distance in px to register touch swipe
  const minSwipeDistance = 50;

  // Next slide handler (infinite loop)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Previous slide handler (infinite loop)
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Select specific slide directly & reset timer
  const selectSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Preload next slide image for seamless transitions
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % totalSlides;
    const nextImg = new Image();
    nextImg.src = SLIDES_DATA[nextIdx].image;
    
    // Also preload previous slide for reverse navigation
    const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
    const prevImg = new Image();
    prevImg.src = SLIDES_DATA[prevIdx].image;
  }, [currentIndex, totalSlides]);

  // Auto-play timer management (5000ms duration)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, nextSlide]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe Gesture Handlers for Mobile
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentSlide = SLIDES_DATA[currentIndex];

  // Multilingual slide speech readout for all 13 Indian languages
  const handleReadCurrentSlide = () => {
    const narrationMap = {
      0: {
        en: "GramNiti AI — Empowering Villages with AI. Discover schemes, services and opportunities simplified for every rural citizen.",
        hi: "ग्रामनीती एआई — गाँवों को एआई से सशक्त बनाना। हर ग्रामीण नागरिक के लिए सरकारी योजनाएं, सेवाएं और व्यापारिक अवसर सरल और सुलभ।",
        mr: "ग्रामनीती एआय — गावांना एआय द्वारे सक्षम करणे. प्रत्येक ग्रामीण नागरिकासाठी सरकारी योजना, सेवा आणि व्यवसायाच्या संधी सोप्या व उपलब्ध.",
        bn: "গ্রামনীতি এআই — এআই দিয়ে গ্রামগুলোকে ক্ষমতায়ন করা। প্রতিটি গ্রামীণ নাগরিকের জন্য সরকারি প্রকল্প, সেবা এবং সুযোগ সহজলভ্য করা।",
        gu: "ગ્રામનીતિ AI — ગામડાઓને AI દ્વારા સક્ષમ બનાવવું. દરેક ગ્રામીણ નાગરિક માટે સરકારી યોજનાઓ અને વ્યવસાયની તકો સરળ અને સુલભ.",
        pa: "ਗ੍ਰਾਮਨੀਤੀ AI — ਪਿੰਡਾਂ ਨੂੰ AI ਨਾਲ ਸਮਰੱਥ ਬਣਾਉਣਾ। ਹਰ ਪੇਂਡੂ ਨਾਗਰਿਕ ਲਈ ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਸੇਵਾਵਾਂ ਅਤੇ ਕਾਰੋਬਾਰੀ ਮੌਕੇ ਆਸਾਨ ਬਣਾਉਣਾ।",
        ta: "கிராம்நீதி AI — கிராமங்களை AI மூலம் மேம்படுத்துதல். ஒவ்வொரு கிராமப்புற குடிமகனுக்கும் அரசு திட்டங்கள் மற்றும் வணிக வாய்ப்புகளை எளிதாக்குதல்.",
        te: "గ్రామనీతి AI — గ్రామాలను AI తో శక్తివంతం చేయడం. ప్రతి గ్రామీణ పౌరుడికి ప్రభుత్వ పథకాలు మరియు వ్యాపార అవకాశాలను సులభతరం చేయడం.",
        kn: "ಗ್ರಾಮನೀತಿ AI — ಹಳ್ಳಿಗಳನ್ನು AI ಮೂಲಕ ಸಶಕ್ತಗೊಳಿಸುವುದು. ಪ್ರತಿಯೊಬ್ಬ ಗ್ರಾಮೀಣ ನಾಗರಿಕರಿಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಅವಕಾಶಗಳನ್ನು ಸುಲಭಗೊಳಿಸುವುದು.",
        ml: "ഗ്രാംനീതി AI — ഗ്രാമങ്ങളെ AI വഴി ശാക്തീകരിക്കുക. ഓരോ ഗ്രാമീണ പൗരനും സർക്കാർ പദ്ധതികളും ബിസിനസ്സ് അവസരങ്ങളും ലളിതമാക്കുന്നു.",
        or: "ଗ୍ରାମନୀତି AI — ଗାଁକୁ AI ଦ୍ୱାରା ସଶକ୍ତ କରିବା। ପ୍ରତ୍ୟେକ ଗ୍ରାମୀଣ ନାଗରିକଙ୍କ ପାଇଁ ସରକାରୀ ଯୋଜନା ଏବଂ ସୁଯୋଗ ସରଳ କରିବା।",
        as: "গ্ৰামনীতি AI — AI ৰ সহায়ত গাঁওসমূহক শক্তিশালী কৰা। প্ৰতিজন গ্ৰামীণ নাগৰিকৰ বাবে চৰকাৰী আঁচনি আৰু ব্যৱসায়িক সুযোগ সহজলভ্য কৰা।",
        ur: "گرام نیتی AI — دیہاتوں کو AI سے بااختیار بنانا۔ ہر دیہی شہری کے لیے سرکاری اسکیموں اور کاروباری مواقع کو آسان بنانا۔"
      },
      1: {
        en: "Bridging the Rural Information Gap — Solving scattered information, complex schemes, language barriers, and limited accessibility.",
        hi: "ग्रामीण सूचना अंतर को पाटना — सूचना का बिखराव, जटिल सरकारी योजनाएं, भाषा की बाधाएं और डिजिटल पहुंच की कमी को दूर करना।",
        mr: "ग्रामीण माहितीतील दरी मिटवणे — विखुरलेली माहिती, क्लिष्ट सरकारी योजना, भाषेचा अडथळा आणि डिजिटल सुलभतेचा अभाव दूर करणे.",
        bn: "গ্রামীণ তথ্যের ব্যবধান দূর করা — তথ্যের বিচ্ছিন্নতা, জটিল সরকারি প্রকল্প, ভাষার বাধা এবং ডিজিটাল অ্যাক্সেসের অভাব সমাধান করা।",
        gu: "ગ્રામીણ માહિતી અંતર ઘટાડવું — વિખરાયેલી માહિતી, જટિલ સરકારી યોજનાઓ, ભાષાના અવરોધો અને ડિજિટલ પહોંચની સમસ્યાનું નિરાકરણ.",
        pa: "ਪੇਂਡੂ ਜਾਣਕਾਰੀ ਦੇ ਪਾੜੇ ਨੂੰ ਦੂਰ ਕਰਨਾ — ਖਿਲਰੀ ਜਾਣਕਾਰੀ, ਗੁੰਝਲਦਾਰ ਸਕੀਮਾਂ, ਭਾਸ਼ਾ ਦੀਆਂ ਰੁਕਾਵਟਾਂ ਅਤੇ ਡਿਜੀਟਲ ਪਹੁੰਚ ਦੀ ਘਾਟ ਨੂੰ ਹੱਲ ਕਰਨਾ।",
        ta: "கிராமப்புற தகவல் இடைவெளியைக் குறைத்தல் — சிதறிய தகவல்கள், சிக்கலான அரசு திட்டங்கள், மொழி தடைகள் மற்றும் டிஜிட்டல் அணுகல் குறைபாடுகளை சரிசெய்தல்.",
        te: "గ్రామీణ సమాచార అంతరాన్ని తగ్గించడం — చెల్లాచెదురైన సమాచారం, సంక్లిష్టమైన పథకాలు, భాషా అడ్డంకులు మరియు డిజిటల్ లభ్యత సమస్యలను పరిష్కరించడం.",
        kn: "ಗ್ರಾಮೀಣ ಮಾಹಿತಿ ಅಂತರವನ್ನು ನಿವಾರಿಸುವುದು — ಚದುರಿದ ಮಾಹಿತಿ, ಸಂಕೀರ್ಣ ಯೋಜನೆಗಳು, ಭಾಷಾ ಅಡೆತಡೆಗಳು ಮತ್ತು ಸೀಮಿತ ಡಿಜಿಟಲ್ ಪ್ರವೇಶವನ್ನು ನಿವಾರಿಸುವುದು.",
        ml: "ഗ്രാമീണ വിവര വിടവ് നികത്തുക — വികേന്ദ്രീകൃത വിവരങ്ങൾ, സങ്കീർണ്ണമായ പദ്ധതികൾ, ഭാഷാ തടസ്സങ്ങൾ എന്നിവ പരിഹരിക്കുന്നു.",
        or: "ଗ୍ରାମୀଣ ସୂଚନା ବ୍ୟବଧାନ ଦୂର କରିବା — ବିକ୍ଷିପ୍ତ ସୂଚନା, ଜଟିଳ ସରକାରୀ ଯୋଜନା, ଭାଷାଗତ ବାଧା ଏବଂ ଡିଜିଟାଲ୍ ଅସୁବିଧାକୁ ସମାଧାନ କରିବା।",
        as: "গ্ৰামীণ তথ্যৰ ব্যৱধান দূৰ কৰা — বিচ্ছিন্ন তথ্য, জটিল চৰকাৰী আঁচনি, ভাষাৰ বাধা আৰু সীমিত ডিজিটেল সুবিধাৰ সমস্যা সমাধান কৰা।",
        ur: "دیہی معلومات کے فرق کو دور کرنا — بکھری ہوئی معلومات، پیچیدہ سرکاری اسکیموں، زبان کی رکاوٹوں اور ڈیجیٹل رسائی کے مسائل کا حل۔"
      },
      2: {
        en: "One Platform, Smarter Access — Connecting citizens through the AI engine to personalized insights and verified government schemes.",
        hi: "एक मंच, स्मार्ट पहुंच — नागरिक से ग्रामनीती एआई इंजन, व्यक्तिगत सूचना और सरकारी योजनाएं।",
        mr: "एक व्यासपीठ, स्मार्ट प्रवेश — नागरिक ते ग्रामनीती एआय इंजिन, वैयक्तिक माहिती आणि सरकारी योजना.",
        bn: "একটি প্ল্যাটফর্ম, স্মার্ট অ্যাক্সেস — নাগরিক থেকে গ্রামনীতি এআই ইঞ্জিন, ব্যক্তিগত অন্তর্দৃষ্টি এবং যাচাইকৃত সরকারি প্রকল্প।",
        gu: "એક પ્લેટફોર્મ, સ્માર્ટ પહોંચ — નાગરિકથી ગ્રામનીતિ AI એન્જિન, વ્યક્તિગત માર્ગદર્શન અને ચકાસાયેલ સરકારી યોજનાઓ.",
        pa: "ਇੱਕ ਪਲੇਟਫਾਰਮ, ਸਮਾਰਟ ਪਹੁੰਚ — ਨਾਗਰਿਕ ਤੋਂ ਗ੍ਰਾਮਨੀਤੀ AI ਇੰਜਣ, ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਸਕੀਮਾਂ।",
        ta: "ஒரே தளம், சிறந்த அணுகல் — குடிமக்களை AI இன்ஜின் மூலம் தனிப்பயனாக்கப்பட்ட தகவல்கள் மற்றும் சரிபார்க்கப்பட்ட அரசு திட்டங்களுடன் இணைத்தல்.",
        te: "ఒకే వేదిక, తెలివైన యాక్సెస్ — పౌరులను AI ఇంజిన్ ద్వారా వ్యక్తిగత విశ్లేషణ మరియు ధృవీకరించిన ప్రభుత్వ పథకాలతో అనుసంధానించడం.",
        kn: "ಒಂದೇ ವೇದಿಕೆ, ಸ್ಮಾರ್ಟ್ ಪ್ರವೇಶ — ನಾಗರಿಕರನ್ನು AI ಎಂಜಿನ್ ಮೂಲಕ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು.",
        ml: "ഏകീകൃത പ്ലാറ്റ്‌ഫോം, മികച്ച സേവനം — പൗരന്മാരെ AI എഞ്ചിൻ വഴി വ്യക്തിഗത വിവരങ്ങളിലേക്കും സർക്കാർ പദ്ധതികളിലേക്കും ബന്ധിപ്പിക്കുന്നു.",
        or: "ଗୋଟିଏ ପ୍ଲାଟଫର୍ମ, ସ୍ମାର୍ଟ ପ୍ରବେଶ — ନାଗରିକଙ୍କୁ AI ଇଞ୍ଜିନ୍ ମାଧ୍ୟମରେ ବ୍ୟକ୍ତିଗତ ମାର୍ଗଦର୍ଶନ ଏବଂ ଯାଞ୍ଚ ହୋଇଥିବା ସରକାରୀ ଯୋଜନା ସହିତ ଯୋଡ଼ିବା।",
        as: "এটা প্লেটফৰ্ম, স্মাৰ্ট প্ৰৱেশ — নাগৰিকক AI ইঞ্জিনৰ জৰিয়তে ব্যক্তিগত নিৰ্দেশনা আৰু পৰীক্ষিত চৰকাৰী আঁচনিৰ সৈতে সংযোগ কৰা।",
        ur: "ایک پلیٹ فارم، اسمارٹ رسائی — شہریوں کو AI انجن کے ذریعے ذاتی معلومات اور تصدیق شدہ سرکاری اسکیموں سے جوڑنا۔"
      },
      3: {
        en: "From Citizen Query to Action — Streamlined pipeline from inquiry to AI understanding, verified data, and bank-ready DPR draft.",
        hi: "नागरिक प्रश्न से सीधी कार्रवाई — उपयोगकर्ता प्रश्न, एआई समझ, सरकारी डेटा, सटीक सिफारिश और बैंक के लिए डीपीआर ड्राफ्ट।",
        mr: "नागरिक प्रश्नापासून प्रत्यक्ष कृतीपर्यंत — वापरकर्ता प्रश्न, एआय समज, सरकारी डेटा, अचूक शिफारस आणि बँकेसाठी डीपीआर मसुदा.",
        bn: "নাগরিকের প্রশ্ন থেকে সরাসরি পদক্ষেপ — প্রশ্ন থেকে এআই বিশ্লেষণ, সরকারি ডেটা, সঠিক সুপারিশ এবং ব্যাংক-প্রস্তুত ডিপিআর খসড়া।",
        gu: "નાગરિક પ્રશ્નથી સીધી કાર્યવાહી — પૂછપરછથી લઈને AI સમજણ, સરકારી ડેટા, સચોટ ભલામણ અને બેંક-તૈયાર DPR ડ્રાફ્ટ.",
        pa: "ਨਾਗਰਿਕ ਦੇ ਸਵਾਲ ਤੋਂ ਸਿੱਧੀ ਕਾਰਵਾਈ — ਪੁੱਛਗਿੱਛ ਤੋਂ ਲੈ ਕੇ AI ਸਮਝ, ਸਰਕਾਰੀ ਡੇਟਾ, ਸਹੀ ਸਿਫਾਰਸ਼ ਅਤੇ ਬੈਂਕ-ਤਿਆਰ DPR ਡਰਾਫਟ।",
        ta: "குடிமக்களின் கேள்வியிலிருந்து நேரடி நடவடிக்கை — விசாரணை முதல் AI புரிதல், அரசு தரவு, துல்லியமான பரிந்துரை மற்றும் வங்கிக்குத் தேவையான DPR வரைவு.",
        te: "పౌరుల ప్రశ్న నుండి ప్రత్యక్ష కార్యాచరణ — విచారణ నుండి AI అవగాహన, ప్రభుత్వ డేటా, ఖచ్చితమైన సిఫార్సు మరియు బ్యాంక్-సిద్ధం DPR డ్రాఫ్ట్.",
        kn: "ನಾಗರಿಕರ ಪ್ರಶ್ನೆಯಿಂದ ನೇರ ಕ್ರಮ — ವಿಚಾರಣೆಯಿಂದ AI ಗ್ರಹಿಕೆ, ಸರ್ಕಾರಿ ಡೇಟಾ, ನಿಖರ ಶಿಫಾರಸು ಮತ್ತು ಬ್ಯಾಂಕ್-ಸಿದ್ಧ DPR ಕರಡು.",
        ml: "പൗരന്റെ ചോദ്യത്തിൽ നിന്ന് നേരിട്ടുള്ള നടപടിയിലേക്ക് — അന്വേഷണം മുതൽ AI വിശകലനം, സർക്കാർ ഡാറ്റ, കൃത്യമായ ശുപാർശ, ബാങ്ക് ഡിപിആർ ഡ്രാഫ്റ്റ്.",
        or: "ନାଗରିକଙ୍କ ପ୍ରଶ୍ନରୁ ସିଧାସଳଖ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ — ଅନୁସନ୍ଧାନରୁ AI ବିଶ୍ଳେଷଣ, ସରକାରୀ ତଥ୍ୟ, ସଠିକ୍ ସୁପାରିଶ ଏବଂ ବ୍ୟାଙ୍କ-ପ୍ରସ୍ତୁତ DPR ଡ୍ରାଫ୍ଟ।",
        as: "নাগৰিকৰ প্ৰশ্নৰ পৰা প্ৰত্যক্ষ কাৰ্যপন্থা — প্ৰশ্নৰ পৰা AI বিশ্লেষণ, চৰকাৰী তথ্য, সঠিক পৰামৰ্শ আৰু বেংকৰ উপযোগী DPR খচৰা।",
        ur: "شہری کے سوال سے براہ راست عمل — پوچھ گچھ سے AI تجزیہ، سرکاری ڈیٹا، درست سفارش اور بینک کے لیے DPR کا مسودہ۔"
      },
      4: {
        en: "Building Smarter, More Empowered Villages — Driving 75%+ scheme awareness, faster services, 13 Indian languages, and rural growth.",
        hi: "अधिक सशक्त, स्मार्ट गाँव का निर्माण — बेहतर योजना जागरूकता, तेज़ सेवाएं, 13 भारतीय भाषाओं में पहुंच और डेटा-आधारित विकास।",
        mr: "अधिक सक्षम, स्मार्ट गावांची निर्मिती — उत्तम योजना जागरूकता, वेगवान सेवा, १३ भारतीय भाषांमध्ये प्रवेश आणि डेटा-आधारित विकास.",
        bn: "স্মার্ট ও ক্ষমতায়িত গ্রাম গঠন — ৭৫% এর বেশি প্রকল্প সচেতনতা, দ্রুত সেবা, ১৩টি ভারতীয় ভাষা এবং গ্রামীণ সমৃদ্ধি।",
        gu: "વધુ સક્ષમ, સ્માર્ટ ગામોનું નિર્માણ — ૭૫% થી વધુ યોજના જાગૃતિ, ઝડપી સેવાઓ, ૧૩ ભારતીય ભાષાઓમાં પહોંચ અને ગ્રામીણ વિકાસ.",
        pa: "ਵਧੇਰੇ ਸਮਰੱਥ, ਸਮਾਰਟ ਪਿੰਡਾਂ ਦੀ ਉਸਾਰੀ — 75%+ ਸਕੀਮ ਜਾਗਰੂਕਤਾ, ਤੇਜ਼ ਸੇਵਾਵਾਂ, 13 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਪਹੁੰਚ ਅਤੇ ਪੇਂਡੂ ਵਿਕਾਸ।",
        ta: "திறமையான, அதிகாரம் பெற்ற கிராமங்களை உருவாக்குதல் — 75%+ திட்ட விழிப்புணர்வு, விரைவான சேவைகள், 13 இந்திய மொழிகளில் அணுகல் மற்றும் வளர்ச்சி.",
        te: "మరింత శక్తివంతమైన, స్మార్ట్ గ్రామాల నిర్మాణం — 75%+ పథకాల అవగాహన, వేగవంతమైన సేవలు, 13 భారతీయ భాషలలో ప్రవేశం మరియు అభివృద్ధి.",
        kn: "ಹೆಚ್ಚು ಸಶಕ್ತ, ಸ್ಮಾರ್ಟ್ ಹಳ್ಳಿಗಳ ನಿರ್ಮಾಣ — 75%+ ಯೋಜನೆ ಜಾಗೃತಿ, ತ್ವರಿತ ಸೇವೆಗಳು, 13 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಪ್ರವೇಶ ಮತ್ತು ಗ್ರಾಮೀಣ ಬೆಳವಣಿಗೆ.",
        ml: "ശാക്തീകരിക്കപ്പെട്ട സ്മാർട്ട് ഗ്രാമങ്ങൾ നിർമ്മിക്കുക — 75%+ പദ്ധതി അവബോധം, വേഗത്തിലുള്ള സേവനങ്ങൾ, 13 ഇന്ത്യൻ ഭാഷകളിലെ ലഭ്യത.",
        or: "ସଶକ୍ତ, ସ୍ମାର୍ଟ ଗାଁ ନିର୍ମାଣ — ୭୫% ରୁ ଅଧିକ ଯୋଜନା ସଚେତନତା, ଦ୍ରୁତ ସେବା, ୧୩ଟି ଭାରତୀୟ ଭାଷାରେ ଉପଲବ୍ଧତା ଏବଂ ଗ୍ରାମୀଣ ବିକାଶ।",
        as: "অধিক শক্তিশালী, স্মাৰ্ট গাঁও গঠন — ৭৫% তকৈ অধিক আঁচনি সচেতনতা, ক্ষিপ্ৰ সেৱা, ১৩ টা ভাৰতীয় ভাষাত প্ৰৱেশ আৰু গ্ৰামীণ বিকাশ।",
        ur: "زیادہ بااختیار، اسمارٹ دیہاتوں کی تعمیر — 75%+ اسکیموں کی آگاہی، تیز رفتار خدمات، 13 ہندوستانی زبانوں میں رسائی اور دیہی ترقی۔"
      }
    };

    const narrations = narrationMap[currentIndex] || narrationMap[0];
    const text = narrations[language] || narrations['en'];
    speak(text);
  };

  return (
    <div className="w-full space-y-3">
      {/* 1. Main 16:9 Presentation Viewport */}
      <section
        ref={carouselContainerRef}
        aria-label="GramNiti AI Key Features Slideshow"
        aria-roledescription="carousel"
        className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl focus:outline-none transition-all"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides Viewport */}
        <div className="relative w-full h-full">
          {SLIDES_DATA.map((slide, idx) => (
            <CarouselSlide
              key={slide.id}
              slide={slide}
              index={idx}
              currentIndex={currentIndex}
              totalSlides={totalSlides}
              setActiveTab={setActiveTab}
              selectSlide={selectSlide}
            />
          ))}
        </div>

        {/* Vertically Centered Left & Right Arrow Controls */}
        <CarouselControls onPrev={prevSlide} onNext={nextSlide} />

        {/* Bottom-Center Interactive Pagination Dots */}
        <PaginationDots
          totalSlides={totalSlides}
          currentIndex={currentIndex}
          onSelectSlide={selectSlide}
          isPlaying={!isPaused}
          onTogglePlay={() => setIsPaused(!isPaused)}
        />
      </section>

      {/* 2. Interactive Presentation Dock (Controls & Instant Action Trigger) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        {/* Left: Slide Info & Audio Narrator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Slide {currentIndex + 1} of {totalSlides}</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <span className="text-slate-600 font-semibold hidden md:inline truncate max-w-xs">
            {currentSlide.title}
          </span>

          <button
            type="button"
            onClick={isSpeaking ? stopAudio : handleReadCurrentSlide}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-50 text-[#14532D] hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={`Listen to slide in ${language.toUpperCase()}`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#166534]" />}
            <span>{isSpeaking ? 'Stop Audio' : `Listen (${language.toUpperCase()})`}</span>
          </button>
        </div>

        {/* Right: Working Action Button matching the current slide */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title={isPaused ? 'Resume auto-slideshow' : 'Pause slideshow'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(currentSlide.actionTab || 'advisor')}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>{currentSlide.actionLabel || 'Explore Features'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
