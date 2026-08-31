"""
Unit tests for GramNiti 13-Language Multilingual System and RAG Engine
"""

import pytest
from app.services.rag_engine import RAGEngine


def test_language_detection_all_13_languages():
    """
    Tests script & lexical detection for all 13 supported Indian languages:
    en, hi, mr, bn, gu, pa, ta, te, kn, ml, or, as, ur
    """
    samples = {
        "en": "How can I apply for PMEGP loan subsidy for dairy farming?",
        "hi": "डेयरी फार्मिंग के लिए पीएमईजीपी योजना में कितनी सब्सिडी मिलती है?",
        "mr": "डेअरी फार्मिंग व्यवसायासाठी शासकीय अनुदान कसे मिळेल आणि कागदपत्रे कोणती लागतील?",
        "bn": "ডেইরি ফার্মিং ব্যবসার জন্য সরকারি ভর্তুকি কীভাবে পাওয়া যাবে?",
        "gu": "ડેરી ફાર્મિંગ વ્યવસાય માટે સરકારી સબસિડી કેવી રીતે મેળવવી?",
        "pa": "ਡੇਅਰੀ ਕਾਰੋਬਾਰ ਲਈ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਕਿਵੇਂ ਮਿਲੇਗੀ?",
        "ta": "பால் பண்ணை தொழிலுக்கு அரசு மானியம் பெறுவது எப்படி?",
        "te": "డైరీ ఫార్మింగ్ వ్యాపారం కోసం ప్రభుత్వ సబ్సిడీ ఎలా పొందాలి?",
        "kn": "ಡೈರಿ ಫಾರ್ಮಿಂಗ್ ಉದ್ಯಮಕ್ಕಾಗಿ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಪಡೆಯುವುದು ಹೇಗೆ?",
        "ml": "ഡയറി ഫാമിംഗ് സംരംഭത്തിന് സർക്കാർ സബ്‌സിഡി എങ്ങനെ ലഭിക്കും?",
        "or": "ଡାଏରୀ ବ୍ୟବସାୟ ପାଇଁ ସରକାରୀ ସବସିଡି କିପରି ମିଳିବ?",
        "as": "দুগ্ধ ব্যৱসায়ৰ বাবে চৰকাৰী ৰাজসাহায্য কেনেকৈ পোৱা যাব?",
        "ur": "ڈیری فارمنگ کے کاروبار کے لیے سرکاری سبسڈی کیسے حاصل کی جائے؟"
    }

    for expected_lang, text in samples.items():
        detected = RAGEngine.detect_language(text)
        assert detected == expected_lang, f"Failed for {expected_lang}: got {detected} for '{text}'"


def test_rag_multilingual_responses_with_citations():
    """
    Tests RAG Engine returns localized replies and official citations
    across different languages without hallucinating schemes.
    """
    languages_to_test = ["en", "hi", "mr", "bn", "gu", "pa", "ta", "te", "kn", "ml", "or", "as", "ur"]
    
    for lang in languages_to_test:
        res = RAGEngine.answer_query("PMEGP loan subsidy scheme", user_language=lang)
        assert res.language == lang
        assert len(res.reply_text) > 20
        assert len(res.citations) > 0
        assert any(c.verification_status == "OFFICIALLY_VERIFIED" for c in res.citations)
        assert any("kviconline.gov.in" in c.official_portal_url or "jansamarth" in c.official_portal_url for c in res.citations)


def test_rag_fraud_warning_in_multiple_languages():
    """
    Tests fraud detection response in multiple languages.
    """
    for lang in ["en", "hi", "mr", "ta", "te", "ur"]:
        res = RAGEngine.answer_query("Is paying ₹2000 advance fee for loan real or scam?", user_language=lang)
        assert res.language == lang
        assert len(res.citations) > 0
        assert len(res.suggested_followups) > 0


def test_rag_document_and_mudra_queries():
    """
    Tests that document checklist and Mudra loan queries return accurate information and citations.
    """
    doc_res = RAGEngine.answer_query("What documents are required for PMEGP loan?", user_language="en")
    assert "Aadhaar" in doc_res.reply_text or "Checklist" in doc_res.reply_text
    assert len(doc_res.citations) > 0

    mudra_res = RAGEngine.answer_query("Tell me about Mudra loan limits Shishu Kishore Tarun", user_language="hi")
    assert "शिशु" in mudra_res.reply_text or "मुद्रा" in mudra_res.reply_text
    assert len(mudra_res.citations) > 0

    poultry_res = RAGEngine.answer_query("कुक्कुटपालन पोल्ट्री फार्मिंग योजना अनुदान", user_language="mr")
    assert "NLM" in poultry_res.reply_text or "अनुदान" in poultry_res.reply_text
    assert len(poultry_res.citations) > 0

