"""
Document Intelligence & Scheme-Specific Document Mapping Engine for GramNiti AI
Maps specific official documents required for each government scheme and enterprise sector.
Supports complete trilingual metadata (English, Hindi, Marathi), issuing authority guidelines,
document category classification, approval stages, and DEMO OCR simulated text recognition.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class DocumentChecklistItem(BaseModel):
    doc_code: str
    name: str
    name_hi: str
    name_mr: str
    description: str
    description_hi: str
    description_mr: str
    category: str = "KYC_IDENTITY"  # "KYC_IDENTITY", "BENEFIT_ELIGIBILITY", "TECHNICAL_FINANCIAL", "STATUTORY_COMPLIANCE"
    approval_stage: str = "Stage 1: Application Submission"  # "Stage 1: Application Submission", "Stage 2: Bank Sanction", "Stage 3: Subsidy Claim & Disbursement"
    is_mandatory: bool = True
    is_ready: bool = False
    issuing_authority: str
    issuing_authority_hi: str
    issuing_authority_mr: str
    how_to_obtain: str = "Apply at nearest CSC or designated department portal."
    how_to_obtain_hi: str = "निकटतम सीएससी केंद्र अथवा संबंधित सरकारी कार्यालय से प्राप्त करें।"
    how_to_obtain_mr: str = "जवळच्या आपले सरकार सेवा केंद्र (CSC) किंवा संबंधित कार्यालयातून मिळवा."
    scheme_relevance: str
    scheme_relevance_hi: str
    scheme_relevance_mr: str
    uploaded_file_name: Optional[str] = None
    demo_ocr_detected: bool = False
    extracted_text_preview: Optional[str] = None


class DocumentChecklistResult(BaseModel):
    scheme_code: str
    scheme_name: str
    business_name: str
    total_required: int
    ready_count: int
    readiness_percentage: float
    documents: List[DocumentChecklistItem] = Field(default_factory=list)
    disclaimer: str = (
        "DEMO OCR NOTICE: Text recognition and document classification are simulated for prototype demonstration. "
        "Automated OCR detection confirms document format type only and DOES NOT constitute legal verification, "
        "official authenticity proof, or government clearance."
    )


class ApprovalStageItem(BaseModel):
    stage_number: int
    stage_name: str
    stage_name_hi: str
    stage_name_mr: str
    description: str
    description_hi: str
    description_mr: str
    required_docs_summary: List[str]
    timeframe: str


class EasySchemeExplanation(BaseModel):
    simple_summary_en: str
    simple_summary_hi: str
    simple_summary_mr: str
    real_math_example_en: str
    real_math_example_hi: str
    real_math_example_mr: str
    who_can_apply_en: List[str]
    who_can_apply_hi: List[str]
    who_can_apply_mr: List[str]
    allowed_businesses_en: List[str]
    allowed_businesses_hi: List[str]
    allowed_businesses_mr: List[str]
    easy_steps_en: List[str]
    easy_steps_hi: List[str]
    easy_steps_mr: List[str]
    audio_narration_en: str
    audio_narration_hi: str
    audio_narration_mr: str


class SchemeDocumentRoadmapResponse(BaseModel):
    scheme_id: str
    scheme_code: str
    scheme_name: str
    ministry: str
    official_portal_url: str
    max_subsidy_percentage: float
    category_breakdown: Dict[str, int]
    approval_stages: List[ApprovalStageItem]
    documents: List[DocumentChecklistItem]
    statutory_conditions: List[str]
    easy_explanation: Optional[EasySchemeExplanation] = None
    disclaimer: str = (
        "This checklist is compiled directly from official Ministry guidelines and gazette notifications. "
        "Ensure all documents are self-attested and matching your Aadhaar demographic details before bank submission."
    )


# Master registry of all scheme & enterprise document requirements with rich trilingual support
DOCUMENT_MASTER_REGISTRY = {
    "AADHAAR": {
        "name": "Aadhaar Card (UIDAI)",
        "name_hi": "आधार कार्ड (यूआईडीएआई)",
        "name_mr": "आधार कार्ड (UIDAI)",
        "desc": "Primary identity & residential address proof with active mobile link for OTP e-KYC.",
        "desc_hi": "ओटीपी ई-केवाईसी हेतु मोबाइल से जुड़ा प्राथमिक पहचान एवं निवास प्रमाण पत्र।",
        "desc_mr": "ओटीपी ई-केवायसीसाठी मोबाईल लिंक असलेले प्राथमिक ओळख व रहिवासी प्रमाणपत्र.",
        "category": "KYC_IDENTITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Unique Identification Authority of India (UIDAI)",
        "issuing_hi": "भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)",
        "issuing_mr": "भारतीय विशिष्ट ओळख प्राधिकरण (UIDAI)",
        "how_to_obtain": "Download e-Aadhaar from uidai.gov.in or visit nearest Aadhaar Seva Kendra.",
        "how_to_obtain_hi": "uidai.gov.in से ई-आधार डाउनलोड करें अथवा आधार केंद्र से प्राप्त करें।",
        "how_to_obtain_mr": "uidai.gov.in वरून ई-आधार डाउनलोड करा किंवा आधार केंद्राला भेट द्या.",
        "relevance": "Mandatory for all central/state DBT schemes and bank loan e-KYC.",
        "relevance_hi": "सभी केंद्रीय/राज्य डीबीटी योजनाओं एवं बैंक लोन ई-केवाईसी हेतु अनिवार्य।",
        "relevance_mr": "सर्व केंद्र/राज्य डीबीटी योजना आणि बँक कर्ज ई-केवायसीसाठी अनिवार्य."
    },
    "PAN": {
        "name": "PAN Card (Income Tax Dept)",
        "name_hi": "पैन कार्ड (आयकर विभाग)",
        "name_mr": "पॅन कार्ड (प्राप्तिकर विभाग)",
        "desc": "Permanent Account Number for credit bureau (CIBIL) score check and tax compliance.",
        "desc_hi": "क्रेडिट ब्यूरो (सिबिल) जांच एवं उद्यम कर अनुपालन हेतु पैन कार्ड।",
        "desc_mr": "क्रेडिट ब्युरो (CIBIL) तपासणी आणि उद्यम कर नोंदणीसाठी आवश्यक.",
        "category": "KYC_IDENTITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Income Tax Department of India",
        "issuing_hi": "आयकर विभाग, भारत सरकार",
        "issuing_mr": "प्राप्तिकर विभाग, भारत सरकार",
        "how_to_obtain": "Apply online at onlineservices.nsdl.com or UTIITSL portal (Instant e-PAN via Aadhaar is free).",
        "how_to_obtain_hi": "incometax.gov.in पर तत्काल निःशुल्क ई-पैन बनाएं अथवा NSDL/UTIITSL से आवेदन करें।",
        "how_to_obtain_mr": "incometax.gov.in वर मोफत इन्स्टंट ई-पॅन काढा किंवा NSDL केंद्रातून अर्ज करा.",
        "relevance": "Mandatory for bank loan underwriting and commercial enterprise account.",
        "relevance_hi": "बैंक ऋण जांच एवं वाणिज्यिक खाते हेतु अनिवार्य।",
        "relevance_mr": "बँक कर्ज तपासणी आणि खात्यासाठी अनिवार्य."
    },
    "PASSPORT_PHOTO": {
        "name": "Passport Size Photographs (3 Copies)",
        "name_hi": "पासपोर्ट साइज फोटोग्राफ (3 प्रतियां)",
        "name_mr": "पासपोर्ट आकाराचे फोटो (३ प्रती)",
        "desc": "Recent color photographs of the applicant for loan application and KVIC identity card.",
        "desc_hi": "आवेदक के हालिया रंगीन पासपोर्ट फोटो जो लोन आवेदन एवं पहचान पत्र हेतु आवश्यक हैं।",
        "desc_mr": "कर्ज अर्ज आणि अधिकृत ओळखपत्रासाठी अर्जदाराचे अद्ययावत रंगीत फोटो.",
        "category": "KYC_IDENTITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Authorized Photo Studio / Self with White Background",
        "issuing_hi": "अधिकृत फोटो स्टूडियो / सफेद पृष्ठभूमि फोटो",
        "issuing_mr": "अधिकृत फोटो स्टुडिओ / पांढऱ्या पार्श्वभूमीवरील फोटो",
        "how_to_obtain": "Get standard passport-sized photos with white background.",
        "how_to_obtain_hi": "सफेद बैकग्राउंड वाले 3.5x4.5 सेमी रंगीन फोटो खिंचवाएं।",
        "how_to_obtain_mr": "पांढऱ्या बॅकग्राउंडवरील ३.५x४.५ सेमी रंगीत फोटो तयार ठेवा.",
        "relevance": "Required for physical loan agreement and bank branch KYC dossier.",
        "relevance_hi": "बैंक शाखा में लोन फाइल एवं हस्ताक्षर मिलान हेतु आवश्यक।",
        "relevance_mr": "बँक शाखा कर्ज नस्ती आणि स्वाक्षरी पडताळणीसाठी आवश्यक."
    },
    "BANK_STATEMENT": {
        "name": "Bank Passbook / 6-Month Account Statement",
        "name_hi": "बैंक पासबुक / 6 माह का खाता विवरण",
        "name_mr": "बँक पासबुक / ६ महिन्यांचे खाते विवरण (Statement)",
        "desc": "Proof of active savings/current account showing IFSC code, account number, and transaction history.",
        "desc_hi": "सक्रिय बैंक खाता प्रमाण जिसमें आईएफएससी कोड, खाता संख्या और लेन-देन दर्ज हो।",
        "desc_mr": "आयएफएससी कोड, खाते क्रमांक आणि बँक व्यवहार दर्शवणारा पुरावा.",
        "category": "KYC_IDENTITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Operating Commercial / Rural / Co-operative Bank Branch",
        "issuing_hi": "संबंधित वाणिज्यिक / ग्रामीण / सहकारी बैंक शाखा",
        "issuing_mr": "संबंधित राष्ट्रीयीकृत / ग्रामीण / सहकारी बँक शाखा",
        "how_to_obtain": "Download 6-month PDF statement via net banking or get passbook updated with stamp from home branch.",
        "how_to_obtain_hi": "नेट बैंकिंग से 6 माह का स्टेटमेंट डाउनलोड करें अथवा बैंक शाखा से मुहर लगवाकर प्राप्त करें।",
        "how_to_obtain_mr": "नेट बँकिंगवरून ६ महिन्यांचे स्टेटमेंट डाउनलोड करा किंवा बँकेतून पासबुक शिक्का मारून घ्या.",
        "relevance": "Required for credit assessment and direct subsidy deposit under DBT.",
        "relevance_hi": "ऋण मूल्यांकन और प्रत्यक्ष सब्सिडी हस्तांतरण हेतु आवश्यक।",
        "relevance_mr": "कर्ज मूल्यांकन आणि थेट अनुदान जमा करण्यासाठी आवश्यक."
    },
    "CASTE_CERTIFICATE": {
        "name": "Category / Caste Certificate (SC/ST/OBC/Minority/Women)",
        "name_hi": "जाति / श्रेणी प्रमाण पत्र (अनुसूचित जाति/जनजाति/ओबीसी/महिला)",
        "name_mr": "जातीचे प्रमाणपत्र (SC/ST/OBC/महिला/अल्पसंख्याक)",
        "desc": "Statutory certificate proving beneficiary belongs to designated special subsidy category for higher 35% margin money.",
        "desc_hi": "सक्षम प्राधिकारी द्वारा जारी प्रमाण पत्र जो विशेष श्रेणी सब्सिडी पात्रता सिद्ध करे।",
        "desc_mr": "विशेष प्रवर्गातील ३५% अनुदान अथवा स्टँड-अप इंडिया लाभासाठी अधिकृत प्रमाणपत्र.",
        "category": "BENEFIT_ELIGIBILITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Sub-Divisional Magistrate (SDM) / Tahsildar / Revenue Department",
        "issuing_hi": "उप-विभागीय मजिस्ट्रेट (SDM) / तहसीलदार कार्यालय",
        "issuing_mr": "उपविभागीय अधिकारी (SDM) / तहसीलदार कार्यालय",
        "how_to_obtain": "Apply via State e-District portal (e.g. Aaple Sarkar in Maharashtra, Edistrict UP) or Tehsil office.",
        "how_to_obtain_hi": "राज्य ई-डिस्ट्रिक्ट पोर्टल अथवा तहसील कार्यालय में आवेदन कर प्राप्त करें।",
        "how_to_obtain_mr": "आपले सरकार (Aaple Sarkar) पोर्टलवरून किंवा तहसील कार्यालयातून डिजिटल दाखला मिळवा.",
        "relevance": "Mandatory to unlock 35% subsidy rate in PMEGP and Stand-Up India eligibility.",
        "relevance_hi": "PMEGP में 35% सब्सिडी एवं स्टैंड-अप इंडिया पात्रता हेतु आवश्यक।",
        "relevance_mr": "PMEGP मध्ये ३५% अनुदान व स्टँड-अप इंडिया योजनेसाठी आवश्यक."
    },
    "RURAL_AREA_CERTIFICATE": {
        "name": "Rural Area Certificate / Gram Panchayat NOC",
        "name_hi": "ग्रामीण क्षेत्र प्रमाण पत्र / ग्राम पंचायत अनापत्ति प्रमाण पत्र",
        "name_mr": "ग्रामीण भाग दाखला / ग्रामपंचायत ना-हरकत प्रमाणपत्र (NOC)",
        "desc": "Certification confirming the proposed project is located in a designated rural area for 25%-35% subsidy eligibility.",
        "desc_hi": "प्रमाण पत्र जो प्रमाणित करे कि इकाई 25%-35% सब्सिडी हेतु ग्रामीण क्षेत्र में स्थित है।",
        "desc_mr": "युनिट ग्रामीण भागात असल्याचा दाखला, ज्यामुळे २५% ते ३५% अनुदानाचा लाभ मिळतो.",
        "category": "BENEFIT_ELIGIBILITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Gram Sevak / Village Sarpanch / Block Development Officer (BDO)",
        "issuing_hi": "ग्राम सेवक / सरपंच / खंड विकास अधिकारी (BDO)",
        "issuing_mr": "ग्रामसेवक / सरपंच / गट विकास अधिकारी (BDO)",
        "how_to_obtain": "Request from your Gram Panchayat Office on official letterhead signed by Gram Sevak.",
        "how_to_obtain_hi": "ग्राम पंचायत कार्यालय से ग्राम सेवक / प्रधान द्वारा हस्ताक्षरित पत्र प्राप्त करें।",
        "how_to_obtain_mr": "ग्रामपंचायत कार्यालयातून ग्रामसेवक व सरपंचांच्या स्वाक्षरीचा दाखला घ्या.",
        "relevance": "Specific requirement under PMEGP & CMEGP for claiming higher rural subsidy rates.",
        "relevance_hi": "PMEGP योजना में उच्च ग्रामीण सब्सिडी प्राप्त करने हेतु अनिवार्य।",
        "relevance_mr": "PMEGP अंतर्गत उच्च ग्रामीण अनुदानाचा लाभ घेण्यासाठी आवश्यक."
    },
    "EDUCATIONAL_PROOF": {
        "name": "Educational Qualification Certificate (8th / 10th Pass)",
        "name_hi": "शैक्षणिक योग्यता प्रमाण पत्र (8वीं / 10वीं उत्तीर्ण)",
        "name_mr": "शैक्षणिक पात्रता दाखला (८ वी किंवा १० वी उत्तीर्ण गुणपत्रिका)",
        "desc": "Proof of minimum educational qualification for manufacturing projects exceeding ₹10 Lakh or service > ₹5 Lakh.",
        "desc_hi": "₹10 लाख से अधिक लागत वाली विनिर्माण परियोजनाओं हेतु 8वीं उत्तीर्ण प्रमाण पत्र।",
        "desc_mr": "१० लाखांपेक्षा जास्त खर्चाच्या उत्पादन प्रकल्पांसाठी ८ वी उत्तीर्ण गुणपत्रक.",
        "category": "BENEFIT_ELIGIBILITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Recognized School Board / State Board of Secondary Education",
        "issuing_hi": "मान्यता प्राप्त विद्यालय / शिक्षा बोर्ड",
        "issuing_mr": "मान्यताप्राप्त शाळा / माध्यमिक शिक्षण मंडळ",
        "how_to_obtain": "Original school leaving certificate (TC) or 8th/10th marksheet.",
        "how_to_obtain_hi": "विद्यालय से मूल अंकतालिका अथवा स्थानांतरण प्रमाण पत्र (TC) प्रस्तुत करें।",
        "how_to_obtain_mr": "शाळा सोडल्याचा दाखला (LC) किंवा १० वी उत्तीर्ण गुणपत्रिका जोडा.",
        "relevance": "Statutory eligibility condition under PMEGP for projects above ₹10 Lakh.",
        "relevance_hi": "PMEGP योजना में ₹10 लाख से ऊपर विनिर्माण हेतु आवश्यक।",
        "relevance_mr": "PMEGP मध्ये १० लाखांवरील उत्पादन प्रकल्पांसाठी अनिवार्य अट."
    },
    "DOMICILE_CERTIFICATE": {
        "name": "State Domicile Certificate (Age / Domicile Proof)",
        "name_hi": "राज्य मूल निवास प्रमाण पत्र (डोमिसाइल)",
        "name_mr": "राज्य रहिवासी दाखला (Domicile Certificate)",
        "desc": "Official proof that applicant is a permanent resident of the respective State for state schemes.",
        "desc_hi": "प्रमाणित दस्तावेज कि आवेदक संबंधित राज्य का स्थायी निवासी है।",
        "desc_mr": "अर्जदार संबंधित राज्याचा कायमस्वरूपी रहिवासी असल्याचा अधिकृत पुरावा.",
        "category": "BENEFIT_ELIGIBILITY",
        "stage": "Stage 1: Online Application Submission",
        "issuing": "Executive Magistrate / Tahsildar Office",
        "issuing_hi": "तहसीलदार / उप-जिलाधिकारी कार्यालय",
        "issuing_mr": "तहसीलदार / नायब तहसीलदार कार्यालय",
        "how_to_obtain": "Apply via State Citizen Portal (e.g. MahaOnline, e-Sathi UP) with ration card and electricity bill.",
        "how_to_obtain_hi": "राज्य सेवा पोर्टल अथवा तहसील कार्यालय में राशन कार्ड व बिजली बिल के साथ आवेदन करें।",
        "how_to_obtain_mr": "आपले सरकार पोर्टलवरून १० ते १५ वर्षांच्या वास्तव्याचा पुरावा जोडून मिळवा.",
        "relevance": "Mandatory for state government schemes like CMEGP, Mukhyamantri Yuva Swarojgar.",
        "relevance_hi": "राज्य स्तरीय योजनाओं में सब्सिडी प्राप्त करने हेतु अनिवार्य।",
        "relevance_mr": "राज्य शासनाच्या CMEGP योजना व स्थानिक अनुदानासाठी अनिवार्य."
    },
    "PROJECT_REPORT": {
        "name": "Detailed Project Report (Bank-Ready DPR)",
        "name_hi": "विस्तृत परियोजना रिपोर्ट (डीपीआर)",
        "name_mr": "सविस्तर प्रकल्प अहवाल (Bank-Ready DPR)",
        "desc": "Techno-economic project feasibility report detailing capital costs, DSCR ratio, cashflows, and EMI viability.",
        "desc_hi": "पूंजीगत लागत, नकदी प्रवाह एवं ईएमआई क्षमता दर्शाने वाली तकनीकी-आर्थिक व्यवहार्यता रिपोर्ट।",
        "desc_mr": "भांडवली खर्च, नफा-तोटा आणि बँक हप्ता परतफेड क्षमता दर्शवणारा तांत्रिक-आर्थिक अहवाल.",
        "category": "TECHNICAL_FINANCIAL",
        "stage": "Stage 2: Bank Appraisal & Sanction",
        "issuing": "GramNiti AI Generated / Chartered Accountant / DIC Approved Format",
        "issuing_hi": "ग्रामनीती जनरेटेड / चार्टर्ड अकाउंटेंट / डीआईसी",
        "issuing_mr": "ग्रामनीती प्रमाणित / सीए / जिल्हा उद्योग केंद्र (DIC)",
        "how_to_obtain": "Generate directly from GramNiti AI Action Plan tab or consult an empanelled CA/DIC officer.",
        "how_to_obtain_hi": "ग्रामनीती एआई एक्शन प्लान पेज से बैंक-रेडी प्रारूप में सीधे डाउनलोड करें।",
        "how_to_obtain_mr": "ग्रामनीती AI च्या 'Action Plan' टॅबमधून थेट अधिकृत बँक अहवाल तयार करा.",
        "relevance": "Primary document reviewed by bank loan sanctioning officer to determine viability.",
        "relevance_hi": "बैंक ऋण मूल्यांकन एवं सरकारी सब्सिडी स्वीकृति हेतु सबसे महत्वपूर्ण दस्तावेज।",
        "relevance_mr": "बँक कर्ज मंजुरी आणि अनुदानासाठी सर्वात महत्त्वाचे तांत्रिक कागदपत्र."
    },
    "MACHINERY_QUOTATION": {
        "name": "Machinery & Equipment Quotations with GST",
        "name_hi": "मशीनरी एवं उपकरण दर-पत्रक (GST सहित कोटेशन)",
        "name_mr": "मशिनरी / उपकरणे अधिकृत दरपत्रक (GST सह Quotation)",
        "desc": "Official price quotation from authorized machine manufacturers/dealers with specifications and GSTIN.",
        "desc_hi": "अधिकृत मशीनरी डीलर द्वारा जारी मूल्य कोटेशन जिसमें जीएसटी नंबर एवं तकनीकी विवरण शामिल हो।",
        "desc_mr": "अधिकृत मशिनरी विक्रेत्याचे जीएसटी क्रमांकासह तांत्रिक दरपत्रक.",
        "category": "TECHNICAL_FINANCIAL",
        "stage": "Stage 2: Bank Appraisal & Sanction",
        "issuing": "Authorized Equipment Manufacturers / Registered GST Vendors",
        "issuing_hi": "पंजीकृत मशीनरी विक्रेता / उपकरण निर्माता",
        "issuing_mr": "नोंदणीकृत मशिनरी उत्पादक / अधिकृत विक्रेता",
        "how_to_obtain": "Obtain Proforma Invoice (Quotation) from 2 reputable suppliers for bank comparison.",
        "how_to_obtain_hi": "कम से कम 2 अधिकृत डीलरों से जीएसटी युक्त प्रोफार्मा इनवॉइस प्राप्त करें।",
        "how_to_obtain_mr": "दोन नामांकित विक्रेत्यांकडून जीएसटी असलेले कोटेशन प्राप्त करा.",
        "relevance": "Bank disburses term loan directly to machinery vendor based on this quotation.",
        "relevance_hi": "बैंक इस कोटेशन के आधार पर सीधे वेंडर को लोन राशि का भुगतान करता है।",
        "relevance_mr": "बँक या कोटेशननुसार थेट मशिनरी विक्रेत्याच्या खात्यात कर्जाची रक्कम जमा करते."
    },
    "LAND_DOCUMENT_7_12": {
        "name": "Land Record (7/12 Extract / Khasra-Khatauni / Rent Lease)",
        "name_hi": "भू-अभिलेख (7/12 खतौनी / खसरा / किराया अनुबंध)",
        "name_mr": "जमीन महसूल ७/१२ उतारा, ८-अ किंवा नोंदणीकृत भाडेकरार",
        "desc": "Proof of land ownership or minimum 3 to 5-year registered lease agreement for enterprise premises.",
        "desc_hi": "पशु शेड अथवा इकाई परिसर हेतु भूमि स्वामित्व अथवा पंजीकृत किराया अनुबंध का प्रमाण।",
        "desc_mr": "गोठा किंवा प्रकल्प उभारणीसाठी स्वतःच्या जमिनीचा पुरावा किंवा नोंदणीकृत भाडेकरार.",
        "category": "TECHNICAL_FINANCIAL",
        "stage": "Stage 2: Bank Appraisal & Sanction",
        "issuing": "Revenue Department / Tahsildar / Talathi Office / Sub-Registrar",
        "issuing_hi": "राजस्व विभाग / तहसीलदार कार्यालय / उप-पंजीयक",
        "issuing_mr": "महसूल विभाग / तहसीलदार / तलाठी कार्यालय / दुय्यम निबंधक",
        "how_to_obtain": "Download digitally signed 7/12 from Mahabhumi / Bhulekh portal or execute a notarized rent agreement.",
        "how_to_obtain_hi": "राज्य भूलेख पोर्टल से डिजिटल खतौनी निकालें अथवा 5 वर्षीय किराया अनुबंध बनवाएं।",
        "how_to_obtain_mr": "महाभूमी (Mahabhumi) पोर्टलवरून डिजिटल ७/१२ काढा किंवा भाडेकरार नोंदणी करा.",
        "relevance": "Mandatory for unit premises verification during bank field inspection.",
        "relevance_hi": "बैंक फील्ड निरीक्षण के दौरान परिसर सत्यापन हेतु आवश्यक।",
        "relevance_mr": "बँकेच्या प्रत्यक्ष जागेची पाहणी व तपासणीसाठी आवश्यक."
    },
    "ELECTRICITY_BILL": {
        "name": "Electricity Bill / Power Connection Quotation",
        "name_hi": "बिजली का बिल / वाणिज्यिक विद्युत कनेक्शन कोटेशन",
        "name_mr": "वीज बिल / व्यावसायिक वीज जोडणी कोटेशन",
        "desc": "Proof of commercial power availability at proposed enterprise premises.",
        "desc_hi": "प्रस्तावित परिसर में विद्युत उपलब्धता का प्रमाण या विद्युत बोर्ड कनेक्शन कोटेशन।",
        "desc_mr": "प्रकल्पाच्या जागेवरील वीज जोडणीचा पुरावा किंवा वीज वितरण कंपनीचे कोटेशन.",
        "category": "TECHNICAL_FINANCIAL",
        "stage": "Stage 2: Bank Appraisal & Sanction",
        "issuing": "State Electricity Distribution Company (e.g. MSEDCL, UPPCL, BESCOM)",
        "issuing_hi": "राज्य विद्युत वितरण निगम",
        "issuing_mr": "महावितरण (MSEDCL) किंवा संबंधित वीज वितरण कंपनी",
        "how_to_obtain": "Latest 2 months paid electricity bill of premises.",
        "how_to_obtain_hi": "परिसर का नवीनतम 2 माह का बिजली बिल संलग्न करें।",
        "how_to_obtain_mr": "जागेचे चालू महिन्यातील भरलेले वीज बिल जोडा.",
        "relevance": "Essential for agro-processing, cold storage, and flour/oil mill sanction.",
        "relevance_hi": "आटा चक्की, तेल मिल एवं खाद्य प्रसंस्करण हेतु आवश्यक।",
        "relevance_mr": "दळण गिरणी, तेल घाणा आणि कृषी प्रक्रिया उद्योगांसाठी आवश्यक."
    },
    "UDYAM_REGISTRATION": {
        "name": "Udyam MSME Registration Certificate",
        "name_hi": "उद्यम एमएसएमई पंजीकरण प्रमाण पत्र",
        "name_mr": "उद्यम नोंदणी प्रमाणपत्र (Udyam MSME)",
        "desc": "Free central MSME registration certificate recognizing the enterprise under Ministry of MSME.",
        "desc_hi": "सूक्ष्म उद्यम हेतु एमएसएमई मंत्रालय के पोर्टल से प्राप्त आधिकारिक पंजीकरण।",
        "desc_mr": "सूक्ष्म व लघू उद्योगासाठी केंद्र सरकारच्या एमएसएमई पोर्टलवरील मोफत नोंदणी.",
        "category": "STATUTORY_COMPLIANCE",
        "stage": "Stage 3: Subsidy Claim & Disbursement",
        "issuing": "Ministry of MSME (udyamregistration.gov.in)",
        "issuing_hi": "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय",
        "issuing_mr": "सूक्ष्म, लघू आणि मध्यम उद्योग मंत्रालय (केंद्र शासन)",
        "how_to_obtain": "Register for free online at udyamregistration.gov.in using Aadhaar and PAN.",
        "how_to_obtain_hi": "udyamregistration.gov.in पर बिना किसी शुल्क के आधार से 5 मिनट में पंजीकरण करें।",
        "how_to_obtain_mr": "udyamregistration.gov.in वर आधार कार्डद्वारे ५ मिनिटांत मोफत नोंदणी करा.",
        "relevance": "Required for collateral exemption up to ₹10 Lakh and priority sector bank benefits.",
        "relevance_hi": "प्राथमिकता प्राप्त ऋण एवं सरकारी सब्सिडी क्लेम हेतु अनिवार्य।",
        "relevance_mr": "प्राधान्य क्षेत्रातील बँक सवलती आणि अनुदान जमा करण्यासाठी आवश्यक."
    },
    "FOOD_SAFETY_DECLARATION": {
        "name": "FSSAI Food Safety Registration / License",
        "name_hi": "एफएसएसएआई खाद्य सुरक्षा पंजीकरण / लाइसेंस",
        "name_mr": "FSSAI अन्न सुरक्षा नोंदणी प्रमाणपत्र / हमीपत्र",
        "desc": "Basic food safety standards registration for agro-processing, dairy, flour mill, or spice units.",
        "desc_hi": "खाद्य प्रसंस्करण हेतु मूल खाद्य सुरक्षा मानक पंजीकरण या शपथ पत्र।",
        "desc_mr": "अन्न व तेल प्रक्रिया उद्योगासाठी मूलभूत अन्न सुरक्षा नोंदणी किंवा हमीपत्र.",
        "category": "STATUTORY_COMPLIANCE",
        "stage": "Stage 3: Subsidy Claim & Disbursement",
        "issuing": "Food Safety and Standards Authority of India (FSSAI)",
        "issuing_hi": "भारतीय खाद्य संरक्षा एवं मानक प्राधिकरण (FSSAI)",
        "issuing_mr": "भारतीय अन्न सुरक्षा आणि मानके प्राधिकरण (FSSAI)",
        "how_to_obtain": "Apply online at foscos.fssai.gov.in (Basic registration fee is ₹100/year).",
        "how_to_obtain_hi": "foscos.fssai.gov.in पोर्टल पर बेसिक रजिस्ट्रेशन हेतु ₹100 शुल्क में आवेदन करें।",
        "how_to_obtain_mr": "foscos.fssai.gov.in पोर्टलवरून ₹१०० शुल्कात ऑनलाइन नोंदणी करा.",
        "relevance": "Mandatory statutory requirement under PMFME for all food and edible oil enterprises.",
        "relevance_hi": "PMFME खाद्य एवं तेल प्रसंस्करण योजनाओं हेतु अनिवार्य।",
        "relevance_mr": "PMFME अन्न प्रक्रिया, तेल गिरणी व मसाला उद्योगासाठी अनिवार्य."
    },
    "TRAINING_CERTIFICATE": {
        "name": "Livestock / Entrepreneurship Training Certificate (EDP / RSETI)",
        "name_hi": "उद्यमिता / पशुपालन प्रशिक्षण प्रमाण पत्र (आरसेटी / ईडीपी)",
        "name_mr": "उद्योजकता / पशुसंवर्धन प्रशिक्षण प्रमाणपत्र (RSETI / EDP / KVK)",
        "desc": "5 to 10-day training certificate from KVK, RSETI, MCED, or Animal Husbandry Department.",
        "desc_hi": "कृषि विज्ञान केंद्र, आरसेटी अथवा उद्यमिता विकास संस्थान से प्रशिक्षण प्रमाण पत्र।",
        "desc_mr": "कृषी विज्ञान केंद्र (KVK), RSETI किंवा MCED चे ५ ते १० दिवसांचे अधिकृत प्रशिक्षण प्रमाणपत्र.",
        "category": "STATUTORY_COMPLIANCE",
        "stage": "Stage 3: Subsidy Claim & Disbursement",
        "issuing": "RSETI / Krishi Vigyan Kendra (KVK) / MCED / Animal Husbandry Dept",
        "issuing_hi": "आरसेटी / कृषि विज्ञान केंद्र / पशुपालन विभाग",
        "issuing_mr": "RSETI / कृषी विज्ञान केंद्र / पशुसंवर्धन विभाग / MCED",
        "how_to_obtain": "Attend free residential/online training arranged by RSETI or KVIC e-portal.",
        "how_to_obtain_hi": "निकटतम आरसेटी (RSETI) अथवा KVIC ऑनलाइन पोर्टल से निःशुल्क प्रशिक्षण पूर्ण करें।",
        "how_to_obtain_mr": "जवळच्या RSETI केंद्रामध्ये किंवा KVIC ऑनलाइन पोर्टलवरून मोफत प्रशिक्षण पूर्ण करा.",
        "relevance": "Mandatory to release the subsidy (Margin Money TDR) into the borrower's account.",
        "relevance_hi": "सब्सिडी (मार्जिन मनी) बैंक खाते में जारी करने हेतु अनिवार्य शर्त।",
        "relevance_mr": "शासकीय अनुदान (Margin Money) बँकेत जमा होण्यासाठी अनिवार्य अट."
    },
    "MILK_SUPPLY_INTENT_LETTER": {
        "name": "Milk Supply Intent Letter / Dairy Society Tie-Up",
        "name_hi": "दुग्ध आपूर्ति आशय पत्र / डेयरी समिति अनुबंध",
        "name_mr": "दूध संकलन संस्था करार / दूध पुरवठा हमीपत्र",
        "desc": "Formal agreement from village milk co-operative or dairy plant confirming daily milk collection.",
        "desc_hi": "ग्राम दुग्ध सहकारी समिति द्वारा जारी पत्र जो दैनिक दूध खरीद की पुष्टि करे।",
        "desc_mr": "स्थानिक प्राथमिक दूध उत्पादक सहकारी संस्थेचे दूध खरेदी व पुरवठा हमीपत्र.",
        "category": "TECHNICAL_FINANCIAL",
        "stage": "Stage 2: Bank Appraisal & Sanction",
        "issuing": "Village Primary Dairy Co-operative Society / Private Dairy (Amul, Mother Dairy, etc.)",
        "issuing_hi": "ग्राम प्राथमिक दुग्ध सहकारी समिति / प्राइवेट डेयरी",
        "issuing_mr": "गावची प्राथमिक दूध उत्पादक सहकारी संस्था / ब्रँड डेअरी",
        "how_to_obtain": "Request a member passbook or supply intent certificate from your local dairy chairman.",
        "how_to_obtain_hi": "स्थानीय दुग्ध समिति अध्यक्ष अथवा सचिव से खरीद आशय पत्र प्राप्त करें।",
        "how_to_obtain_mr": "स्थानिक दूध डेअरीच्या अध्यक्षांकडून दूध खरेदी हमीपत्र लिहून घ्या.",
        "relevance": "Provides vital cashflow certainty to the bank loan sanctioning officer for dairy projects.",
        "relevance_hi": "डेयरी लोन में नियमित आय सत्यापन हेतु बैंक द्वारा आवश्यक।",
        "relevance_mr": "डेअरी कर्जात नियमित उत्पन्न पडताळणीसाठी बँक तपासणीत महत्त्वाचे."
    }
}


# Scheme to Specific Documents Mapping Rules covering all central and state schemes
SCHEME_DOCUMENT_RULES = {
    "PMEGP": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "MACHINERY_QUOTATION", "RURAL_AREA_CERTIFICATE", "CASTE_CERTIFICATE",
        "EDUCATIONAL_PROOF", "LAND_DOCUMENT_7_12", "TRAINING_CERTIFICATE"
    ],
    "PMFME": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "MACHINERY_QUOTATION", "UDYAM_REGISTRATION", "FOOD_SAFETY_DECLARATION",
        "LAND_DOCUMENT_7_12", "ELECTRICITY_BILL"
    ],
    "PMMY_SHISHU": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "MACHINERY_QUOTATION"
    ],
    "PMMY_KISHORE": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "MACHINERY_QUOTATION", "LAND_DOCUMENT_7_12"
    ],
    "PMMY_TARUN": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "MACHINERY_QUOTATION", "UDYAM_REGISTRATION", "LAND_DOCUMENT_7_12"
    ],
    "STANDUP_INDIA": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "MACHINERY_QUOTATION", "CASTE_CERTIFICATE", "LAND_DOCUMENT_7_12", "UDYAM_REGISTRATION"
    ],
    "NLM_EDP": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "TRAINING_CERTIFICATE", "LAND_DOCUMENT_7_12", "CASTE_CERTIFICATE", "MACHINERY_QUOTATION"
    ],
    "AHIDF": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "LAND_DOCUMENT_7_12", "UDYAM_REGISTRATION", "MACHINERY_QUOTATION", "ELECTRICITY_BILL"
    ],
    "PMMSY": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "LAND_DOCUMENT_7_12", "CASTE_CERTIFICATE", "MACHINERY_QUOTATION"
    ],
    "AIF": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "LAND_DOCUMENT_7_12", "UDYAM_REGISTRATION", "MACHINERY_QUOTATION"
    ],
    "MAHA_CMEGP": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "DOMICILE_CERTIFICATE", "RURAL_AREA_CERTIFICATE", "CASTE_CERTIFICATE",
        "EDUCATIONAL_PROOF", "MACHINERY_QUOTATION", "LAND_DOCUMENT_7_12"
    ],
    "UP_ODOP_SUBSIDY": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "DOMICILE_CERTIFICATE", "CASTE_CERTIFICATE", "UDYAM_REGISTRATION", "MACHINERY_QUOTATION"
    ],
    "GUJ_KUTIR_UDYOG": [
        "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT",
        "DOMICILE_CERTIFICATE", "CASTE_CERTIFICATE", "MACHINERY_QUOTATION"
    ]
}

# Plain-language easy explanations for rural citizens (English, Hindi, Marathi)
EASY_SCHEME_EXPLANATIONS = {
    "PMEGP": {
        "simple_summary_en": "The Government's biggest startup scheme giving up to ₹50 Lakh loan for manufacturing or ₹20 Lakh for service units, with up to 35% FREE subsidy in villages.",
        "simple_summary_hi": "सरकार की सबसे बड़ी स्वरोजगार योजना जिसमें उद्योग लगाने पर ₹50 लाख तक लोन और गांव में 35% तक मुफ्त सब्सिडी (मार्जिन मनी) मिलती है।",
        "simple_summary_mr": "शासनाचा सर्वात मोठा स्वयंरोजगार उपक्रम ज्यामध्ये उत्पादन उद्योगासाठी ₹५० लाखांपर्यंत कर्ज आणि ग्रामीण भागात ३५% पर्यंत मोफत शासकीय अनुदान मिळते.",
        "real_math_example_en": "If your total business costs ₹10,00,000:\n• Government pays: ₹3,50,000 (Free Subsidy)\n• You invest: ₹50,000 only (5% Own Capital)\n• Bank Loan: ₹6,00,000 (Pay in easy monthly EMI)",
        "real_math_example_hi": "यदि आपका कुल प्रोजेक्ट ₹10,00,000 का है:\n• सरकार देगी: ₹3,50,000 (मुफ्त सब्सिडी)\n• आपकी अपनी जेब से: ₹50,000 केवल (5% पूंजी)\n• बैंक लोन: ₹6,00,000 (आसान मासिक किस्तों में चुकाएं)",
        "real_math_example_mr": "जर तुमचा व्यवसाय ₹१०,००,००० खर्चाचा असेल:\n• शासन देईल: ₹३,५०,००० (मोफत अनुदान)\n• तुमचे स्वतःचे भांडवल: फक्त ₹५०,००० (५%)\n• बँक कर्ज: ₹६,००,००० (सुलभ मासिक हप्त्यात परतफेड करा)",
        "who_can_apply_en": ["Any person aged 18 years or older", "Women, youth, farmers, artisans, and self-help groups (SHGs)", "8th standard pass needed only if project is above ₹10 Lakh", "No family income limit"],
        "who_can_apply_hi": ["18 वर्ष या उससे अधिक उम्र का कोई भी व्यक्ति", "महिलाएं, ग्रामीण युवा, किसान, कारीगर एवं स्वयं सहायता समूह", "₹10 लाख से बड़े प्रोजेक्ट हेतु न्यूनतम 8वीं पास होना चाहिए", "परिवार की आय की कोई सीमा नहीं"],
        "who_can_apply_mr": ["१८ वर्षे पूर्ण असलेला कोणताही व्यक्ती", "महिला, तरुण, शेतकरी, कारागीर व बचत गट", "१० लाखांपेक्षा मोठ्या प्रकल्पासाठी किमान ८ वी उत्तीर्ण", "उत्पन्नाची कोणतीही कमाल मर्यादा नाही"],
        "allowed_businesses_en": ["Dairy Farming & Milk Chilling Unit", "Flour Mill / Atta Chakki / Dal Mill / Oil Expeller", "Poultry Farming & Animal Feed Making", "Wood / Metal Fabrication Workshop", "Bakery, Spices Grinding & Food Processing", "Garment Tailoring & Apparel Manufacturing"],
        "allowed_businesses_hi": ["डेयरी फार्मिंग एवं दुग्ध शीतलन इकाई", "आटा चक्की, दाल मिल एवं तेल पेराई घाणा", "पोल्ट्री फार्मिंग एवं पशु आहार निर्माण", "वेल्डिंग, फैब्रिकेशन एवं ग्रामीण वर्कशॉप", "मसाला पिसाई, बेकरी एवं खाद्य प्रसंस्करण", "रेडीमेड गारमेंट सिलाई व वस्त्र निर्माण"],
        "allowed_businesses_mr": ["डेअरी फार्मिंग व दूध प्रक्रिया", "दळण गिरणी, डाळ मिल, तेल घाणा", "कुक्कुटपालन व पशुखाद्य निर्मिती", "वेल्डिंग व फॅब्रिकेशन वर्कशॉप", "मसाले उद्योग, बेकरी व अन्न प्रक्रिया", "रेडिमेड कपडे शिलाई व टेलरिंग"],
        "easy_steps_en": [
            "Step 1: Fill free online application on official portal (kviconline.gov.in) with Aadhaar & PAN.",
            "Step 2: Bank inspects your project premises and approves loan sanction.",
            "Step 3: Bank disburses payment directly to machine supplier.",
            "Step 4: Government deposits 35% subsidy into your bank account as 3-year interest-free deposit."
        ],
        "easy_steps_hi": [
            "स्टेप 1: आधिकारिक kviconline.gov.in पोर्टल पर आधार और पैन के साथ निःशुल्क ऑनलाइन फॉर्म भरें।",
            "स्टेप 2: बैंक आपकी जगह का निरीक्षण कर लोन स्वीकृत करता है।",
            "स्टेप 3: बैंक सीधे मशीन सप्लायर को भुगतान करता है।",
            "स्टेप 4: सरकार 35% सब्सिडी राशि आपके बैंक में 3 वर्ष के लिए ब्याज-मुक्त टीडीआर में जमा करती है।"
        ],
        "easy_steps_mr": [
            "पायरी १: kviconline.gov.in पोर्टलवर आधार व पॅन कार्डसह मोफत ऑनलाइन अर्ज भरा.",
            "पायरी २: बँक प्रत्यक्ष जागेची पाहणी करून कर्ज मंजूर करते.",
            "पायरी ३: बँक थेट मशिनरी विक्रेत्याला पैसे देते.",
            "पायरी ४: शासन ३५% अनुदान बँकेत ३ वर्षांसाठी बिनव्याजी ठेवीत जमा करते."
        ],
        "audio_narration_en": "PMEGP is the Government's premier scheme giving up to 35 percent free subsidy in rural areas. For a 10 Lakh project, government gives 3.5 Lakh subsidy and you invest only 50,000 rupees. Apply online on kviconline portal without paying any agent fee.",
        "audio_narration_hi": "PMEGP सरकार की प्रमुख योजना है जिसमें ग्रामीण क्षेत्रों में 35 प्रतिशत तक मुफ्त सब्सिडी मिलती है। 10 लाख के प्रोजेक्ट पर सरकार 3.5 लाख सब्सिडी देती है और आपको सिर्फ 50,000 रुपये लगाने होते हैं। kviconline पोर्टल पर सीधे आवेदन करें।",
        "audio_narration_mr": "PMEGP ही शासनाची प्रमुख योजना आहे ज्यामध्ये ग्रामीण भागात ३५ टक्क्यांपर्यंत मोफत अनुदान मिळते. १० लाखांच्या प्रकल्पावर शासन साडेतीन लाख अनुदान देते आणि तुम्हाला फक्त ५० हजार रुपये लागतात. अधिकृत पोर्टलवर थेट अर्ज करा."
    },
    "PMFME": {
        "simple_summary_en": "Special scheme for food and agro-processing businesses giving 35% direct subsidy up to ₹10 Lakh to upgrade local village food units.",
        "simple_summary_hi": "खाद्य एवं कृषि प्रसंस्करण व्यवसाय हेतु विशेष योजना जिसमें ₹10 लाख तक 35% सीधी सरकारी सब्सिडी मिलती है।",
        "simple_summary_mr": "अन्न प्रक्रिया व कृषी उद्योगांसाठी विशेष योजना ज्यामध्ये १० लाखांपर्यंत ३५% थेट शासकीय भांडवली अनुदान मिळते.",
        "real_math_example_en": "For a ₹10,00,000 Food Processing Unit:\n• Government pays: ₹3,50,000 (35% Direct Subsidy)\n• You invest: ₹1,00,000 (10% Margin)\n• Bank Loan: ₹5,50,000 (At normal priority sector bank interest)",
        "real_math_example_hi": "₹10,00,000 की खाद्य प्रसंस्करण इकाई पर:\n• सरकार देगी: ₹3,50,000 (35% सीधी सब्सिडी)\n• आपकी पूंजी: ₹1,00,000 (10% मार्जिन)\n• बैंक ऋण: ₹5,50,000 (प्राथमिकता प्राप्त ब्याज दर पर)",
        "real_math_example_mr": "₹१०,००,००० च्या अन्न प्रक्रिया युनिटवर:\n• शासन देईल: ₹३,५०,००० (३५% थेट अनुदान)\n• तुमचे भांडवल: ₹१,००,००० (१०%)\n• बँक कर्ज: ₹५,५०,००० (कमी व्याजदरात)",
        "who_can_apply_en": ["Individual micro food processors", "Self Help Groups (SHGs) and Farmer Producer Organizations (FPOs)", "Anyone starting or modernizing food, flour, oil, or spice processing units"],
        "who_can_apply_hi": ["व्यक्तिगत लघु खाद्य प्रसंस्करण उद्यमी", "महिला स्वयं सहायता समूह एवं किसान उत्पादक संगठन (FPO)", "आटा, तेल, मसाला, पापड़, अचार या डेयरी उत्पाद शुरू करने वाले नागरिक"],
        "who_can_apply_mr": ["वैयक्तिक अन्न प्रक्रिया उद्योजक", "महिला बचत गट व शेतकरी उत्पादक कंपन्या (FPO)", "पिठ गिरणी, तेल घाणा, मसाला, पापड, लोणचे किंवा दुग्ध प्रक्रिया सुरू करणारे नागरिक"],
        "allowed_businesses_en": ["Flour Mill (Atta Chakki) & Mini Dal Mill", "Cold Pressed Oil Extraction (Tel Ghana)", "Spice Processing & Packaging", "Pickle, Jam, Papad & Snack Making", "Dairy Value Added Products (Paneer, Ghee, Butter)", "Fruit & Vegetable Processing & Solar Drying"],
        "allowed_businesses_hi": ["आटा चक्की एवं मिनी दाल मिल", "कोल्ड प्रेस्ड तेल निष्कर्षण (कच्ची घाणी)", "मसाला पिसाई एवं पैकेजिंग यूनिट", "अचार, पापड़, जैम एवं नमकीन निर्माण", "डेयरी उत्पाद (पनीर, घी, मक्खन)", "फल-सब्जी प्रसंस्करण एवं सोलर ड्रायर"],
        "allowed_businesses_mr": ["दळण गिरणी व मिनी डाळ मिल", "लाकडी घाणा शुद्ध खाद्यतेल निर्मिती", "मसाला प्रक्रिया व पॅकिंग युनिट", "लोणचे, पापड व बेकरी उत्पादने", "दुग्धजन्य पदार्थ निर्मिती (पनीर, खवा, तूप)", "फळे व भाजीपाला प्रक्रिया"],
        "easy_steps_en": [
            "Step 1: Apply online on pmfme.mofpi.gov.in with Udyam & basic FSSAI.",
            "Step 2: District Resource Person (DRP) helps you prepare DPR free of cost.",
            "Step 3: Bank approves loan and releases payment to machine vendor.",
            "Step 4: Ministry credits 35% subsidy into bank account."
        ],
        "easy_steps_hi": [
            "स्टेप 1: pmfme.mofpi.gov.in पर उद्यम व एफएसएसएआई के साथ आवेदन करें।",
            "स्टेप 2: जिला रिसोर्स पर्सन (DRP) निःशुल्क डीपीआर बनवाने में मदद करता है।",
            "स्टेप 3: बैंक लोन स्वीकृत कर मशीन वेंडर को भुगतान करता है।",
            "स्टेप 4: मंत्रालय सीधे 35% सब्सिडी बैंक में ट्रांसफर करता है।"
        ],
        "easy_steps_mr": [
            "पायरी १: pmfme.mofpi.gov.in वर उद्यम व FSSAI सह ऑनलाइन अर्ज करा.",
            "पायरी २: जिल्हा रिसोर्स पर्सन (DRP) मोफत प्रकल्प अहवाल तयार करून देतो.",
            "पायरी ३: बँक कर्ज मंजूर करून मशिनरी पुरवठादाराला पैसे देते.",
            "पायरी ४: शासन ३५% अनुदान खात्यात जमा करते."
        ],
        "audio_narration_en": "PMFME scheme gives 35 percent direct subsidy up to 10 Lakh rupees for all food and agro processing businesses like flour mills, oil expellers, and spice units. Apply on the official portal and get free DPR assistance.",
        "audio_narration_hi": "PMFME योजना में आटा चक्की, तेल मिल और मसाला उद्योग जैसे सभी खाद्य प्रसंस्करण व्यवसायों पर 35 प्रतिशत तक सीधी सब्सिडी मिलती है। pmfme पोर्टल पर सीधे आवेदन करें।",
        "audio_narration_mr": "PMFME योजनेअंतर्गत पिठ गिरणी, तेल घाणा, मसाला उद्योग यांसारख्या सर्व अन्न प्रक्रिया व्यवसायांवर ३५% थेट अनुदान मिळते. pmfme पोर्टलवर थेट अर्ज करा."
    },
    "PMMY_KISHORE": {
        "simple_summary_en": "Collateral-free micro-loan scheme by Central Govt providing ₹50,000 to ₹5,00,000 without requiring land mortgage or third-party guarantee.",
        "simple_summary_hi": "केंद्र सरकार की गारंटी-मुक्त लोन योजना जिसमें ₹50,000 से ₹5 लाख तक बिना किसी जमीन के कागजात या गारंटर के लोन मिलता है।",
        "simple_summary_mr": "केंद्र शासनाची विना-तारण सुलभ कर्ज योजना ज्यामध्ये ₹५०,००० ते ₹५ लाखांपर्यंत कोणतीही जमीन गहाण न ठेवता सुलभ कर्ज मिळते.",
        "real_math_example_en": "Need ₹2,50,000 for purchasing 2 milch cows or machinery:\n• Zero Land Mortgage / Collateral\n• Easy 3 to 5-year repayment tenure\n• Repay ~₹5,100 per month from daily business earnings",
        "real_math_example_hi": "2 दुधारू गायों अथवा दुकान हेतु ₹2,50,000 की आवश्यकता पर:\n• बिना किसी संपत्ति बंधक के आसान लोन\n• 3 से 5 वर्ष की आसान मासिक किस्तें\n• लगभग ₹5,100 प्रतिमाह की किस्त दैनिक आय से चुकाएं",
        "real_math_example_mr": "२ संकरित गाई किंवा दुकानासाठी ₹२,५०,००० ची गरज असल्यास:\n• विना-तारण १००% सुलभ कर्ज\n• ३ ते ५ वर्षांत सुलभ परतफेड\n• दरमहा सुमारे ₹५,१०० हप्ता व्यवसायाच्या नफ्यातून भरा",
        "who_can_apply_en": ["Small business owners, shopkeepers, and artisans", "Farmers purchasing cows, buffaloes, or farm tools", "Women entrepreneurs and self-employed youth"],
        "who_can_apply_hi": ["छोटे दुकानदार, व्यापारी, कारीगर एवं किसान", "गाय, भैंस, कृषि उपकरण या वाहन खरीदने वाले नागरिक", "महिला उद्यमी एवं स्वरोजगार करने वाले युवा"],
        "who_can_apply_mr": ["लहान दुकानदार, शेतकरी व कारागीर", "गाई, म्हशी किंवा शेती अवजारे खरेदी करणारे नागरिक", "महिला उद्योजक व स्वयंरोजगार सुरू करणारे तरुण"],
        "allowed_businesses_en": ["Dairy & Livestock Units", "Kirana Shop & Retail Outlets", "Automobile Repair & Garages", "Tailoring & Boutique Centers", "Small Village Fabrication"],
        "allowed_businesses_hi": ["डेयरी एवं पशुधन इकाई", "किराना स्टोर एवं खुदरा दुकानें", "ऑटोमोबाइल रिपेयर एवं वर्कशॉप", "टेलरिंग एवं सिलाई केंद्र", "लघु ग्रामीण निर्माण कार्य"],
        "allowed_businesses_mr": ["डेअरी व पशुपालन", "किराणा दुकान व किरकोळ विक्री", "ऑटोमोबाईल गॅरेज व वर्कशॉप", "टेलरिंग व सिलाई केंद्र", "ग्रामीण लघू व्यवसाय"],
        "easy_steps_en": [
            "Step 1: Get Aadhaar, PAN, bank passbook, and machine/livestock quotation.",
            "Step 2: Visit any nationalized or rural bank branch or apply on udyamimitra.in.",
            "Step 3: Bank approves loan under Mudra guarantee (CGFMU).",
            "Step 4: Loan credited into your account or paid directly to seller."
        ],
        "easy_steps_hi": [
            "स्टेप 1: आधार, पैन, बैंक पासबुक और मशीनरी/पशु कोटेशन तैयार रखें।",
            "स्टेप 2: किसी भी बैंक शाखा में संपर्क करें अथवा udyamimitra.in पर आवेदन करें।",
            "स्टेप 3: बैंक बिना गारंटी मुद्रा योजना के तहत लोन स्वीकृत करता है।",
            "स्टेप 4: लोन राशि सीधे आपके खाते अथवा विक्रेता को जारी होती है।"
        ],
        "easy_steps_mr": [
            "पायरी १: आधार, पॅन, बँक पासबुक व मशिनरीचे दरपत्रक तयार ठेवा.",
            "पायरी २: कोणत्याही बँकेत किंवा udyamimitra.in वर अर्ज करा.",
            "पायरी ३: बँक विना-तारण मुद्रा हमी अंतर्गत कर्ज मंजूर करते.",
            "पायरी ४: कर्जाची रक्कम थेट खात्यात किंवा विक्रेत्याला जमा होते."
        ],
        "audio_narration_en": "Pradhan Mantri Mudra Kishore scheme provides loans from 50,000 to 5 Lakh rupees without any property mortgage or guarantee. Ideal for buying cows, shop stock, or small equipment.",
        "audio_narration_hi": "प्रधानमंत्री मुद्रा योजना में ₹50,000 से ₹5 लाख तक बिना किसी संपत्ति गिरवी रखे लोन मिलता है। डेयरी या दुकान शुरू करने हेतु नजदीकी बैंक में आवेदन करें।",
        "audio_narration_mr": "प्रधानमंत्री मुद्रा योजनेअंतर्गत ५० हजार ते ५ लाखांपर्यंत विना-तारण सुलभ कर्ज मिळते. डेअरी किंवा दुकान सुरू करण्यासाठी जवळच्या बँकेत अर्ज करा."
    },
    "NLM_EDP": {
        "simple_summary_en": "National Livestock Mission provides 50% direct capital subsidy (up to ₹50 Lakh) to set up commercial goat, sheep, or poultry breeding farms.",
        "simple_summary_hi": "राष्ट्रीय पशुधन मिशन (NLM) में बकरी, भेड़ या पोल्ट्री फार्मिंग ब्रीडिंग प्रोजेक्ट पर 50% तक सीधा सरकारी अनुदान (अधिकतम ₹50 लाख) मिलता है।",
        "simple_summary_mr": "राष्ट्रीय पशुधन अभियान (NLM) अंतर्गत व्यावसायिक शेळी, मेंढी किंवा कुक्कुटपालन प्रकल्पावर ५०% थेट भांडवली अनुदान (कमाल ₹५० लाख) मिळते.",
        "real_math_example_en": "For a 100-Goat Commercial Unit costing ₹20,00,000:\n• Central Government pays: ₹10,00,000 (50% Direct Grant)\n• You invest: ₹2,00,000 (10% Margin)\n• Bank Loan: ₹8,00,000",
        "real_math_example_hi": "100 बकरियों के ₹20,00,000 के प्रोजेक्ट पर:\n• केंद्र सरकार देगी: ₹10,00,000 (50% मुफ्त अनुदान)\n• आपकी पूंजी: ₹2,00,000 (10%)\n• बैंक लोन: ₹8,00,000",
        "real_math_example_mr": "१०० शेळ्यांच्या ₹२०,००,००० च्या प्रकल्पावर:\n• केंद्र शासन देईल: ₹१०,००,००० (५०% थेट मोफत अनुदान)\n• तुमचे भांडवल: ₹२,००,००० (१०%)\n• बँक कर्ज: ₹८,००,०००",
        "who_can_apply_en": ["Farmers with land available for animal shed & green fodder", "Entrepreneurs, SHGs, and Farmer Producer Organizations (FPOs)", "Trained in animal husbandry (RSETI or KVK training)"],
        "who_can_apply_hi": ["शेड एवं चारा उगाने हेतु भूमि रखने वाले किसान", "उद्यमी, स्वयं सहायता समूह एवं एफपीओ", "पशुपालन में प्रशिक्षित (RSETI अथवा KVK से) नागरिक"],
        "who_can_apply_mr": ["गोठा व चाऱ्यासाठी स्वतःची जमीन असलेले शेतकरी", "उद्योजक, महिला बचत गट व शेतकरी उत्पादक कंपन्या", "पशुसंवर्धन प्रशिक्षण पूर्ण केलेले नागरिक"],
        "allowed_businesses_en": ["Commercial Goat Breeding Farm (100–500 Goats)", "Commercial Sheep Breeding Farm", "Poultry Hatchery & Parent Breeding Unit", "Silage & Fodder Block Manufacturing Plant"],
        "allowed_businesses_hi": ["व्यावसायिक बकरी पालन एवं ब्रीडिंग फार्म", "व्यावसायिक भेड़ पालन फार्म", "पोल्ट्री हैचरी एवं पैरेंट ब्रीडिंग फार्म", "साइलेज एवं पशु चारा ब्लॉक निर्माण इकाई"],
        "allowed_businesses_mr": ["व्यावसायिक शेळीपालन व पैदास फार्म (१०० ते ५०० शेळ्या)", "व्यावसायिक मेंढीपालन फार्म", "कुक्कुटपालन हॅचरी व ब्रीडिंग युनिट", "मुरघास (Silage) व पशुखाद्य निर्मिती युनिट"],
        "easy_steps_en": [
            "Step 1: Complete 5-day animal husbandry training from KVK or RSETI.",
            "Step 2: Submit application & DPR on nlm.udyamimitra.in.",
            "Step 3: State Level Executive Committee approves the project.",
            "Step 4: Government releases 50% subsidy directly in two tranches."
        ],
        "easy_steps_hi": [
            "स्टेप 1: कृषि विज्ञान केंद्र अथवा आरसेटी से 5 दिवसीय प्रशिक्षण पूर्ण करें।",
            "स्टेप 2: nlm.udyamimitra.in पर आवेदन व प्रोजेक्ट रिपोर्ट जमा करें।",
            "स्टेप 3: राज्य स्तरीय समिति प्रोजेक्ट का सत्यापन कर मंजूरी देती है।",
            "स्टेप 4: सरकार 50% अनुदान दो किस्तों में सीधे जारी करती है।"
        ],
        "easy_steps_mr": [
            "पायरी १: कृषी विज्ञान केंद्र (KVK) किंवा RSETI मधून ५ दिवसांचे प्रशिक्षण पूर्ण करा.",
            "पायरी २: nlm.udyamimitra.in वर अर्ज व प्रकल्प अहवाल दाखल करा.",
            "पायरी ३: राज्यस्तरीय समिती प्रकल्प मंजूर करते.",
            "पायरी ४: शासन ५०% अनुदान थेट दोन टप्प्यांत जमा करते."
        ],
        "audio_narration_en": "National Livestock Mission offers 50 percent direct capital subsidy for commercial goat, sheep, and poultry breeding projects. Submit DPR on nlm udyamimitra portal.",
        "audio_narration_hi": "राष्ट्रीय पशुधन मिशन में बकरी और पोल्ट्री ब्रीडिंग प्रोजेक्ट पर 50 प्रतिशत तक सीधा सरकारी अनुदान मिलता है। nlm udyamimitra पोर्टल पर आवेदन करें।",
        "audio_narration_mr": "राष्ट्रीय पशुधन मिशन योजनेअंतर्गत शेळी व पोल्ट्री प्रकल्पावर ५०% थेट सरकारी अनुदान मिळते. nlm udyamimitra पोर्टलवर थेट अर्ज करा."
    }
}


class DocumentEngine:

    @classmethod
    def get_checklist(
        cls,
        business: Dict,
        scheme: Dict,
        uploaded_doc_codes: Optional[List[str]] = None
    ) -> DocumentChecklistResult:
        scheme_code = scheme.get("code", "PMEGP")
        biz_code = business.get("code", "DAIRY_FARMING")
        uploaded = set(uploaded_doc_codes or ["AADHAAR", "PAN", "BANK_STATEMENT", "LAND_DOCUMENT_7_12"])

        # Determine required document codes dynamically from scheme rules
        required_codes = list(SCHEME_DOCUMENT_RULES.get(scheme_code, [
            "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT", "MACHINERY_QUOTATION", "LAND_DOCUMENT_7_12"
        ]))

        # Append business-specific prerequisites
        if biz_code == "DAIRY_FARMING" and "MILK_SUPPLY_INTENT_LETTER" not in required_codes:
            required_codes.append("MILK_SUPPLY_INTENT_LETTER")
        elif biz_code in ["COLD_PRESSED_OIL", "FOOD_PROCESSING", "FLOUR_MILL"] and "FOOD_SAFETY_DECLARATION" not in required_codes:
            required_codes.append("FOOD_SAFETY_DECLARATION")

        items: List[DocumentChecklistItem] = []
        for code in required_codes:
            meta = DOCUMENT_MASTER_REGISTRY.get(code, {
                "name": code.replace("_", " ").title(),
                "name_hi": code,
                "name_mr": code,
                "desc": "Official document required for application verification.",
                "desc_hi": "योजना सत्यापन हेतु आवश्यक आधिकारिक दस्तावेज।",
                "desc_mr": "योजना पडताळणीसाठी आवश्यक अधिकृत कागदपत्र.",
                "category": "KYC_IDENTITY",
                "stage": "Stage 1: Application Submission",
                "issuing": "Competent Government Authority",
                "issuing_hi": "सक्षम सरकारी प्राधिकारी",
                "issuing_mr": "सक्षम शासकीय प्राधिकारी",
                "how_to_obtain": "Apply at nearest CSC or designated department portal.",
                "how_to_obtain_hi": "निकटतम सीएससी केंद्र से प्राप्त करें।",
                "how_to_obtain_mr": "जवळच्या आपले सरकार केंद्रातून मिळवा.",
                "relevance": "Required for statutory eligibility check.",
                "relevance_hi": "पात्रता जांच हेतु आवश्यक।",
                "relevance_mr": "पात्रता तपासणीसाठी आवश्यक."
            })

            is_ready = code in uploaded
            items.append(DocumentChecklistItem(
                doc_code=code,
                name=meta["name"],
                name_hi=meta["name_hi"],
                name_mr=meta["name_mr"],
                description=meta["desc"],
                description_hi=meta["desc_hi"],
                description_mr=meta["desc_mr"],
                category=meta.get("category", "KYC_IDENTITY"),
                approval_stage=meta.get("stage", "Stage 1: Application Submission"),
                is_mandatory=True,
                is_ready=is_ready,
                issuing_authority=meta["issuing"],
                issuing_authority_hi=meta["issuing_hi"],
                issuing_authority_mr=meta["issuing_mr"],
                how_to_obtain=meta.get("how_to_obtain", "Apply at nearest CSC or designated department portal."),
                how_to_obtain_hi=meta.get("how_to_obtain_hi", "निकटतम सीएससी केंद्र से प्राप्त करें।"),
                how_to_obtain_mr=meta.get("how_to_obtain_mr", "जवळच्या आपले सरकार केंद्रातून मिळवा."),
                scheme_relevance=meta["relevance"],
                scheme_relevance_hi=meta["relevance_hi"],
                scheme_relevance_mr=meta["relevance_mr"],
                uploaded_file_name=f"verified_{code.lower()}.pdf" if is_ready else None,
                demo_ocr_detected=is_ready,
                extracted_text_preview=f"DEMO OCR: Valid {code} detected with applicant matching records." if is_ready else None
            ))

        ready_count = sum(1 for d in items if d.is_ready)
        total = len(items)
        readiness_pct = round((ready_count / total * 100.0), 1) if total > 0 else 0.0

        return DocumentChecklistResult(
            scheme_code=scheme_code,
            scheme_name=scheme.get("name", "Government Scheme"),
            business_name=business.get("name", "Rural Enterprise"),
            total_required=total,
            ready_count=ready_count,
            readiness_percentage=readiness_pct,
            documents=items
        )

    @classmethod
    def get_scheme_document_roadmap(cls, scheme: Dict, user_profile: Optional[Dict] = None) -> SchemeDocumentRoadmapResponse:
        scheme_code = scheme.get("code", "PMEGP")
        required_codes = list(SCHEME_DOCUMENT_RULES.get(scheme_code, [
            "AADHAAR", "PAN", "PASSPORT_PHOTO", "BANK_STATEMENT", "PROJECT_REPORT", "MACHINERY_QUOTATION", "LAND_DOCUMENT_7_12"
        ]))

        docs: List[DocumentChecklistItem] = []
        cat_breakdown = {"KYC_IDENTITY": 0, "BENEFIT_ELIGIBILITY": 0, "TECHNICAL_FINANCIAL": 0, "STATUTORY_COMPLIANCE": 0}

        for code in required_codes:
            meta = DOCUMENT_MASTER_REGISTRY.get(code)
            if not meta:
                continue
            
            cat = meta.get("category", "KYC_IDENTITY")
            cat_breakdown[cat] = cat_breakdown.get(cat, 0) + 1

            docs.append(DocumentChecklistItem(
                doc_code=code,
                name=meta["name"],
                name_hi=meta["name_hi"],
                name_mr=meta["name_mr"],
                description=meta["desc"],
                description_hi=meta["desc_hi"],
                description_mr=meta["desc_mr"],
                category=cat,
                approval_stage=meta.get("stage", "Stage 1: Application Submission"),
                is_mandatory=True,
                is_ready=False,
                issuing_authority=meta["issuing"],
                issuing_authority_hi=meta["issuing_hi"],
                issuing_authority_mr=meta["issuing_mr"],
                how_to_obtain=meta.get("how_to_obtain", "Apply at nearest CSC or portal."),
                how_to_obtain_hi=meta.get("how_to_obtain_hi", "निकटतम सीएससी केंद्र से प्राप्त करें।"),
                how_to_obtain_mr=meta.get("how_to_obtain_mr", "आपले सरकार केंद्रातून मिळवा."),
                scheme_relevance=meta["relevance"],
                scheme_relevance_hi=meta["relevance_hi"],
                scheme_relevance_mr=meta["relevance_mr"]
            ))

        # Build 4-Stage Benefit Approval Pathway
        stages = [
            ApprovalStageItem(
                stage_number=1,
                stage_name="Online Application Submission & Task Force Scrutiny",
                stage_name_hi="ऑनलाइन आवेदन एवं जिला टास्क फोर्स जांच",
                stage_name_mr="ऑनलाइन अर्ज नोंदणी आणि जिल्हा टास्क फोर्स छाननी",
                description="Applicant registers on official scheme portal with KYC, category certificates, and rural proofs. Sponsoring agency (DIC/KVIC) verifies applicant eligibility.",
                description_hi="आवेदक आधिकारिक पोर्टल पर केवाईसी, जाति प्रमाण पत्र एवं ग्रामीण दाखिले के साथ आवेदन करता है। डीआईसी/केवीआईसी द्वारा पात्रता सत्यापन किया जाता है।",
                description_mr="अर्जदार अधिकृत पोर्टलवर केवायसी, जातीचे दाखले व ग्रामीण पुराव्यासह अर्ज करतो. डीआयसी/केव्हीआयसी पात्रतेची छाननी करते.",
                required_docs_summary=["Aadhaar", "PAN", "Photo", "Category Proof", "Rural Certificate", "8th/10th Marksheet"],
                timeframe="3 to 7 working days"
            ),
            ApprovalStageItem(
                stage_number=2,
                stage_name="Bank Technical & Financial Loan Appraisal",
                stage_name_hi="बैंक तकनीकी एवं वित्तीय ऋण मूल्यांकन",
                stage_name_mr="बँक तांत्रिक व आर्थिक कर्ज मूल्यांकन व मंजुरी",
                description="Chosen bank branch evaluates the Detailed Project Report (DPR), machinery quotation, premises title, and cash flow DSCR ratio to sanction the loan.",
                description_hi="चयनित बैंक शाखा परियोजना रिपोर्ट (DPR), मशीनरी कोटेशन, परिसर दस्तावेज एवं ईएमआई क्षमता की जांच कर लोन स्वीकृत (Sanction) करती है।",
                description_mr="संबंधित बँक शाखा प्रकल्प अहवाल (DPR), मशिनरी कोटेशन, जागेचा ७/१२ व नफा क्षमता तपासून कर्ज मंजूर (Sanction) करते.",
                required_docs_summary=["Bank-Ready DPR", "Machinery Quotations", "Land Record 7/12 / Rent Lease", "6-Month Bank Statement"],
                timeframe="10 to 15 working days"
            ),
            ApprovalStageItem(
                stage_number=3,
                stage_name="Borrower Margin Deposit & Loan Disbursement",
                stage_name_hi="स्वयं का अंशदान जमा एवं ऋण संवितरण",
                stage_name_mr="स्वतःचे ५%-१०% भांडवल जमा व कर्ज वाटप",
                description="Applicant deposits 5% to 10% own equity into the bank account. Bank directly disburses term loan to machinery vendor accounts.",
                description_hi="आवेदक बैंक खाते में 5%-10% स्वयं का अंशदान जमा करता है। बैंक सीधे मशीनरी वेंडर के खाते में ऋण राशि का भुगतान करता है।",
                description_mr="अर्जदार ५% ते १०% स्वतःचे भांडवल खात्यात भरतो. बँक थेट मशिनरी विक्रेत्याला धनादेशाद्वारे पेमेंट करते.",
                required_docs_summary=["Own Margin Bank Deposit Receipt", "Vendor Bank Account Details", "Udyam MSME Registration"],
                timeframe="3 to 5 working days"
            ),
            ApprovalStageItem(
                stage_number=4,
                stage_name="EDP Training & Margin Money Subsidy Lock-In Credit",
                stage_name_hi="ईडीपी प्रशिक्षण एवं मार्जिन मनी सब्सिडी लॉक-इन",
                stage_name_mr="EDP प्रशिक्षण व २५%-३५% शासकीय अनुदान जमा",
                description="Beneficiary completes mandatory EDP skill training. Government releases 25%-35% subsidy into a 3-year Term Deposit Receipt (TDR) without loan interest.",
                description_hi="लाभार्थी अनिवार्य ईडीपी प्रशिक्षण पूरा करता है। सरकार 25%-35% सब्सिडी राशि बैंक में 3 वर्ष हेतु ब्याज-मुक्त टीडीआर में जमा करती है।",
                description_mr="लाभार्थी EDP प्रशिक्षण पूर्ण करतो. शासन २५% ते ३५% अनुदान बँकेत ३ वर्षांच्या मुदत ठेवीत (TDR) बिनव्याजी जमा करते.",
                required_docs_summary=["EDP / RSETI Training Certificate", "FSSAI / Local Trade NOC", "Joint Physical Inspection Report"],
                timeframe="Within 30 days of first disbursement"
            )
        ]

        conditions = [
            f"Maximum government subsidy available: {scheme.get('subsidy_percentage_special_rural', 35.0)}% in rural locations.",
            f"Beneficiary own contribution requirement: {scheme.get('margin_money_percentage_special', 5.0)}% for special categories / {scheme.get('margin_money_percentage_general', 10.0)}% for general category.",
            "Mandatory 3-year lock-in period for credit-linked subsidy before principal deduction.",
            "All machinery & equipment must be brand new (second-hand equipment not eligible for government subsidy).",
            f"Application must be filed online at the official portal ({scheme.get('official_portal_url', 'kviconline.gov.in')})."
        ]

        # Easy Language Explanation
        easy_exp_raw = EASY_SCHEME_EXPLANATIONS.get(scheme_code)
        if easy_exp_raw:
            easy_explanation_obj = EasySchemeExplanation(**easy_exp_raw)
        else:
            sub_pct = scheme.get('subsidy_percentage_special_rural', 35.0)
            easy_explanation_obj = EasySchemeExplanation(
                simple_summary_en=f"Government financial scheme providing up to {sub_pct}% subsidy and bank loans for rural enterprise setup.",
                simple_summary_hi=f"ग्रामीण उद्यम शुरू करने हेतु {sub_pct}% तक सरकारी सब्सिडी एवं बैंक ऋण सहायता योजना।",
                simple_summary_mr=f"ग्रामीण भागात नवीन व्यवसाय सुरू करण्यासाठी {sub_pct}% पर्यंत शासकीय अनुदान व बँक कर्ज देणारी योजना.",
                real_math_example_en=f"For a ₹10,00,000 project: Govt gives ₹{int(1000000 * sub_pct / 100):,} subsidy. You invest only ₹50,000 to ₹1,00,000, and bank finances the remaining.",
                real_math_example_hi=f"₹10,00,000 के प्रोजेक्ट पर: सरकार ₹{int(1000000 * sub_pct / 100):,} की सब्सिडी देती है। आपको केवल ₹50,000 से ₹1 लाख लगाना होता है।",
                real_math_example_mr=f"₹१०,००,००० च्या प्रकल्पावर: शासन ₹{int(1000000 * sub_pct / 100):,} मोफत अनुदान देते. तुम्हाला फक्त ५० हजार ते १ लाख रुपये स्वतःचे गुंतवावे लागतात.",
                who_can_apply_en=["Any Indian citizen aged 18 years or above", "Rural youth, women, farmers, and entrepreneurs", "No prior business experience strictly required"],
                who_can_apply_hi=["18 वर्ष या उससे अधिक आयु का कोई भी भारतीय नागरिक", "ग्रामीण युवा, महिलाएं, किसान एवं नए उद्यमी", "न्यूनतम 8वीं पास (बड़े प्रोजेक्ट्स हेतु)"],
                who_can_apply_mr=["१८ वर्षे पूर्ण असलेला कोणताही भारतीय नागरिक", "ग्रामीण तरुण, महिला बचत गट, शेतकरी व कारागीर", "मोठ्या प्रकल्पांसाठी किमान ८ वी उत्तीर्ण"],
                allowed_businesses_en=["Dairy Farming & Livestock", "Agro & Food Processing Units", "Rural Workshops, Shops & Services", "Manufacturing & Fabrication"],
                allowed_businesses_hi=["डेयरी फार्मिंग एवं पशुपालन", "आटा चक्की, तेल मिल व खाद्य प्रसंस्करण", "दुकान, वर्कशॉप एवं ग्रामीण सेवाएं", "लघु उद्योग व निर्माण"],
                allowed_businesses_mr=["डेअरी, पोल्ट्री व शेळीपालन", "दळण गिरणी, तेल घाणा व प्रक्रिया उद्योग", "वर्कशॉप, किराणा व ग्रामीण सेवा", "लघू उद्योग व उत्पादन युनिट"],
                easy_steps_en=[
                    "Step 1: Fill free online application on official portal with Aadhaar & PAN.",
                    "Step 2: Bank inspects your site and approves loan sanction.",
                    "Step 3: Bank pays machinery vendor directly.",
                    "Step 4: Government deposits your subsidy into the bank."
                ],
                easy_steps_hi=[
                    "स्टेप 1: आधार एवं पैन के साथ आधिकारिक पोर्टल पर निःशुल्क ऑनलाइन फॉर्म भरें।",
                    "स्टेप 2: बैंक आपकी जगह का निरीक्षण कर लोन पास करता है।",
                    "स्टेप 3: बैंक सीधे मशीनरी विक्रेता को भुगतान करता है।",
                    "स्टेप 4: सरकार आपकी सब्सिडी राशि बैंक में जमा करती है।"
                ],
                easy_steps_mr=[
                    "पायरी १: आधार व पॅन कार्डसह अधिकृत पोर्टलवर मोफत ऑनलाइन अर्ज करा.",
                    "पायरी २: बँक जागेची पाहणी करून कर्ज मंजूर करते.",
                    "पायरी ३: बँक थेट मशिनरी विक्रेत्याला पैसे देते.",
                    "पायरी ४: शासन अनुदानाची रक्कम बँकेत जमा करते."
                ],
                audio_narration_en=f"This scheme helps you start your own rural enterprise with up to {sub_pct} percent government subsidy. You only invest 5 to 10 percent from your pocket, and the bank provides the remaining loan. Apply online without any advance fees.",
                audio_narration_hi=f"यह योजना आपको {sub_pct} प्रतिशत तक सरकारी सब्सिडी के साथ अपना ग्रामीण व्यवसाय शुरू करने में मदद करती है। आपको अपनी जेब से सिर्फ 5 से 10 प्रतिशत लगाना होता है। बिना किसी एजेंट के सीधे ऑनलाइन आवेदन करें।",
                audio_narration_mr=f"ही योजना तुम्हाला {sub_pct} टक्क्यांपर्यंत शासकीय अनुदानासह स्वतःचा व्यवसाय सुरू करण्यास मदत करते. तुम्हाला स्वतःचे फक्त ५ ते १० टक्के भांडवल लागते. कोणत्याही दलालाशिवाय थेट ऑनलाइन अर्ज करा."
            )

        return SchemeDocumentRoadmapResponse(
            scheme_id=scheme.get("scheme_id", "SCHEME_PMEGP"),
            scheme_code=scheme_code,
            scheme_name=scheme.get("name", "Government Scheme"),
            ministry=scheme.get("ministry", "Central Ministry"),
            official_portal_url=scheme.get("official_portal_url", "https://www.kviconline.gov.in/"),
            max_subsidy_percentage=scheme.get("subsidy_percentage_special_rural", 35.0),
            category_breakdown=cat_breakdown,
            approval_stages=stages,
            documents=docs,
            statutory_conditions=conditions,
            easy_explanation=easy_explanation_obj
        )

    @classmethod
    def simulate_ocr_upload(cls, filename: str, sample_text: Optional[str] = None) -> Dict:
        name_clean = filename.lower()
        confidence = 94.5
        doc_type = "UNKNOWN_DOCUMENT"
        extracted = {}

        if "aadhaar" in name_clean:
            doc_type = "AADHAAR_CARD"
            confidence = 98.2
            extracted = {
                "document_type": "Aadhaar Card (UIDAI)",
                "detected_name": "Applicant Matching Record",
                "aadhaar_last_4": "XXXX-XXXX-8921",
                "dob": "1992-06-14",
                "gender": "Female",
                "address_district": "Pune",
                "address_state": "Maharashtra",
                "pincode": "413115",
                "rural_area_verified": True
            }
        elif "pan" in name_clean:
            doc_type = "PAN_CARD"
            confidence = 97.4
            extracted = {
                "document_type": "Permanent Account Number (PAN)",
                "detected_pan": "ABCDE1234F",
                "status": "Individual / Proprietorship Valid",
                "tax_compliance_check": "CLEAR"
            }
        elif "7_12" in name_clean or "land" in name_clean or "khatauni" in name_clean:
            doc_type = "LAND_RECORD_7_12"
            confidence = 95.8
            extracted = {
                "document_type": "Land Record 7/12 Extract",
                "gut_survey_no": "142/3",
                "area_acres": "2.5 Acres (Agricultural / Shed Approved)",
                "encumbrance_status": "CLEAR / NO PRIOR LIEN"
            }
        else:
            doc_type = "GENERIC_SUPPORTING_DOCUMENT"
            confidence = 89.0
            extracted = {
                "document_type": "Supporting Statutory Proof",
                "filename": filename,
                "status": "VALID_FORMAT"
            }

        return {
            "status": "SUCCESS",
            "file_name": filename,
            "detected_document_type": doc_type,
            "ocr_confidence": confidence,
            "extracted_metadata": extracted,
            "disclaimer": (
                "DEMO OCR NOTICE: Text recognition is simulated for prototype demonstration. "
                "Official submission requires self-attested original copies presented to the sanctioning bank branch."
            )
        }
