"""
Hyper-Local Business Feasibility Report Engine for GramNiti AI
Module 1: Generates localized strategic feasibility analysis covering:
1. Market Reach (5-10 km radius consumer base & distribution channels)
2. Opportunity Analysis (Unserved/underserved niches in local economy)
3. General Business Analysis (SWOT tailored to micro-enterprise budget)
4. Threats Identification (Supply chain bottlenecks, seasonal fluctuations, buyer dependency)
5. Competitor Mapping (Localized density & market saturation)
6. Product Market Value (Optimal pricing strategy & purchasing power tier)
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
import uuid


class MarketReachInfo(BaseModel):
    radius_km: str = "5 – 10 km"
    estimated_consumer_base: int = 28500
    consumer_base_description: str
    consumer_base_description_hi: str
    consumer_base_description_mr: str
    primary_distribution_channels: List[str] = Field(default_factory=list)
    primary_distribution_channels_hi: List[str] = Field(default_factory=list)
    primary_distribution_channels_mr: List[str] = Field(default_factory=list)
    market_connectivity_rating: str = "HIGH"  # HIGH, MODERATE, DEVELOPING


class OpportunityAnalysisInfo(BaseModel):
    unserved_niches: List[str] = Field(default_factory=list)
    unserved_niches_hi: List[str] = Field(default_factory=list)
    unserved_niches_mr: List[str] = Field(default_factory=list)
    high_potential_market_gap: str
    high_potential_market_gap_hi: str
    high_potential_market_gap_mr: str
    growth_catalysts: List[str] = Field(default_factory=list)
    growth_catalysts_hi: List[str] = Field(default_factory=list)
    growth_catalysts_mr: List[str] = Field(default_factory=list)


class SWOTAnalysisInfo(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    strengths_hi: List[str] = Field(default_factory=list)
    strengths_mr: List[str] = Field(default_factory=list)
    
    weaknesses: List[str] = Field(default_factory=list)
    weaknesses_hi: List[str] = Field(default_factory=list)
    weaknesses_mr: List[str] = Field(default_factory=list)
    
    opportunities: List[str] = Field(default_factory=list)
    opportunities_hi: List[str] = Field(default_factory=list)
    opportunities_mr: List[str] = Field(default_factory=list)
    
    threats: List[str] = Field(default_factory=list)
    threats_hi: List[str] = Field(default_factory=list)
    threats_mr: List[str] = Field(default_factory=list)


class FeasibilityThreatItem(BaseModel):
    threat_name: str
    threat_name_hi: str
    threat_name_mr: str
    category: str  # "SUPPLY_CHAIN", "SEASONALITY", "BUYER_DEPENDENCY", "BIOLOGICAL_OR_TECH"
    severity: str  # "HIGH", "MEDIUM", "LOW"
    description: str
    description_hi: str
    description_mr: str
    actionable_mitigation: str
    actionable_mitigation_hi: str
    actionable_mitigation_mr: str


class CompetitorMappingInfo(BaseModel):
    estimated_competitor_density: str
    market_saturation_level_pct: float
    saturation_verdict: str  # "UNDERSATURATED", "BALANCED", "HIGHLY_COMPETITIVE"
    estimated_active_units_in_block: int
    competitive_differentiation_strategy: str
    competitive_differentiation_strategy_hi: str
    competitive_differentiation_strategy_mr: str


class ProductMarketValueInfo(BaseModel):
    recommended_unit_price: str
    recommended_unit_price_hi: str
    recommended_unit_price_mr: str
    pricing_strategy: str
    pricing_strategy_hi: str
    pricing_strategy_mr: str
    regional_purchasing_power_tier: str
    predicted_monthly_market_value: str
    predicted_monthly_market_value_hi: str
    predicted_monthly_market_value_mr: str
    pricing_rationale: str
    pricing_rationale_hi: str
    pricing_rationale_mr: str


class BusinessFeasibilityReport(BaseModel):
    feasibility_id: str
    business_id: str
    business_name: str
    business_name_hi: str
    business_name_mr: str
    location_id: str
    village_name: str
    district: str
    state: str
    suitability_score: float
    
    # 6 Core Feasibility Modules
    market_reach: MarketReachInfo
    opportunity_analysis: OpportunityAnalysisInfo
    swot_analysis: SWOTAnalysisInfo
    threats: List[FeasibilityThreatItem] = Field(default_factory=list)
    competitor_mapping: CompetitorMappingInfo
    product_market_value: ProductMarketValueInfo
    
    overall_feasibility_verdict: str
    overall_feasibility_verdict_hi: str
    overall_feasibility_verdict_mr: str
    is_demo_data: bool = True
    disclaimer: str = (
        "HYPER-LOCAL FEASIBILITY NOTICE: This localized strategy report is dynamically generated "
        "using village demographic benchmarks, economic density models, and sector cost norms. "
        "It serves as an indicative operational roadmap for micro-enterprise planning."
    )


class FeasibilityEngine:

    @classmethod
    def generate_feasibility_report(
        cls,
        business: Dict,
        location: Dict,
        user_profile: Dict
    ) -> BusinessFeasibilityReport:
        feasibility_id = f"FEAS_{uuid.uuid4().hex[:8].upper()}"
        
        biz_id = business.get("business_id", "BIZ_DAIRY_FARMING")
        biz_code = business.get("code", "DAIRY_FARMING")
        biz_name = business.get("name", "Dairy Farming")
        biz_hi = business.get("name_hi", "डेयरी फार्मिंग")
        biz_mr = business.get("name_mr", "डेअरी फार्मिंग")
        
        loc_id = location.get("location_id", "LOC_BARAMATI_01")
        village = location.get("village_name", "Malegaon Budruk")
        district = location.get("district", "Pune")
        state = location.get("state", "Maharashtra")
        pop = int(location.get("population", 4850))
        mkt_dist = float(location.get("market_access_distance_km", 5.2))
        power_hrs = float(location.get("power_reliability_hours_per_day", 19.0))
        
        capital = float(user_profile.get("available_capital", 30000.0))
        
        # Calculate localized radius consumer base (approx. 5-7 surrounding villages in block)
        surrounding_consumer_base = int(pop * 5.8)
        
        if biz_code == "DAIRY_FARMING":
            market_reach = MarketReachInfo(
                radius_km="5 – 8 km (Village Cluster & Taluka Mandi)",
                estimated_consumer_base=surrounding_consumer_base,
                consumer_base_description=f"Immediate market of ~{surrounding_consumer_base:,} residents across {village} and 6 neighboring hamlets, plus 12+ local tea stalls, halwais, and daily cooperative chilling centers.",
                consumer_base_description_hi=f"{village} एवं आस-पास के 6 मजरों में लगभग {surrounding_consumer_base:,} निवासियों का सीधा उपभोक्ता आधार, साथ ही 12+ स्थानीय चाय की दुकानें, मिष्ठान भंडार एवं डेयरी कलेक्शन सेंटर।",
                consumer_base_description_mr=f"{village} आणि परिसरातील ६ वाड्या-वस्त्यांमध्ये सुमारे {surrounding_consumer_base:,} ग्राहकांचे थेट मार्केट, तसेच १२+ स्थानिक चहाची दुकाने, मिठाई केंद्रे आणि डेअरी संकलन केंद्र.",
                primary_distribution_channels=[
                    "Direct farmgate milk distribution to village households (Morning 6-8 AM)",
                    "Local Primary Dairy Co-operative Society / Bulk Milk Cooler (BMC)",
                    "B2B daily supply contract with local tea shops and sweetmakers",
                    "Weekly rural haat market for dairy products (curd/paneer)"
                ],
                primary_distribution_channels_hi=[
                    "गाँव के परिवारों को सुबह 6-8 बजे सीधा ताजा दूध वितरण",
                    "स्थानीय प्राथमिक दुग्ध सहकारी समिति / बल्क मिल्क कूलर (BMC)",
                    "स्थानीय चाय की दुकानों और हलवाइयों को दैनिक आपूर्ति अनुबंध",
                    "साप्ताहिक ग्रामीण हाट में पनीर एवं दही की सीधी बिक्री"
                ],
                primary_distribution_channels_mr=[
                    "गावातील ग्राहकांना सकाळी ६-८ दरम्यान थेट ताजे दूध वाटप",
                    "स्थानिक प्राथमिक दूध सहकारी संस्था / बल्क मिल्क कुलर (BMC)",
                    "स्थानिक चहा हॉटेल्स व मिठाई व्यावसायिकांना दररोज थेट पुरवठा",
                    "साप्ताहिक ग्रामीण बाजारात खवा, पनीर व ताज्या दह्याची विक्री"
                ],
                market_connectivity_rating="HIGH" if mkt_dist <= 6.0 else "MODERATE"
            )
            
            opportunity_analysis = OpportunityAnalysisInfo(
                unserved_niches=[
                    "Pure, unadulterated Cow/Buffalo milk with verified fat percentage testing for premium village households",
                    "Fresh evening paneer and curd delivery to local roadside dhabas and dhabewalas",
                    "Packaged organic cow dung vermicompost for local horticulture orchards"
                ],
                unserved_niches_hi=[
                    "शुद्ध, बिना मिलावट वाला फैट-प्रमाणित गाय/भैंस दूध स्थानीय परिवारों हेतु",
                    "शाम को ताजा पनीर एवं दही ढाबों और होटलों तक पहुँचाना",
                    "फलों के बागों हेतु जैविक गोबर केंचुआ खाद (वर्मीकम्पोस्ट) की बिक्री"
                ],
                unserved_niches_mr=[
                    "स्थानिक ग्राहकांसाठी फॅटची खात्री असलेले अस्सल व शुद्ध दूध वाटप",
                    "रस्त्यावरील धाबे आणि हॉटेल्सना संध्याकाळी ताजा पनीर व दही पुरवठा",
                    "फळबागांसाठी गांडूळ खत व शेणखताची विक्री"
                ],
                high_potential_market_gap=f"Substantial unmet local demand for hygienic, temperature-controlled farmgate milk in {village}, where 65% of households currently rely on unorganized loose milk.",
                high_potential_market_gap_hi=f"{village} में स्वच्छ एवं शुद्ध ताजा दूध की भारी मांग, जहाँ 65% परिवार अभी भी अनौपचारिक खुले दूध पर निर्भर हैं।",
                high_potential_market_gap_mr=f"{village} मध्ये उच्च प्रतीच्या स्वच्छ व ताज्या दुधाला मोठी मागणी, जिथे ६५% नागरिक अद्याप असुरक्षित खुल्या दुधावर अवलंबून आहेत.",
                growth_catalysts=[
                    f"Favorable agricultural fodder belt in {district} ensuring steady green nutrition",
                    "Government credit-linked 25%-35% margin subsidy under PMEGP",
                    "Guaranteed minimum daily cashflow from co-operative societies"
                ],
                growth_catalysts_hi=[
                    f"{district} में चारे की सुलभ उपलब्धता जो निरंतर पोषण सुनिश्चित करती है",
                    "PMEGP योजना अंतर्गत 25%-35% सरकारी सब्सिडी सहायता",
                    "सहकारी डेयरी समितियों द्वारा दैनिक/साप्ताहिक गारंटीड भुगतान"
                ],
                growth_catalysts_mr=[
                    f"{district} मधील मुबलक हिरवा चारा व उसाचे वाढे यामुळे कमी खर्चात चारा उपलब्धता",
                    "PMEGP योजनेअंतर्गत २५% ते ३५% शासकीय अनुदान",
                    "दूध डेअरीकडून दर १० दिवसांनी थेट बँक खात्यात खात्रीशीर पेमेंट"
                ]
            )
            
            swot_analysis = SWOTAnalysisInfo(
                strengths=[
                    "Low initial fixed overhead by utilizing ancestral village land for cattle shed",
                    "Family labor involvement reducing external daily wage expenses by ~40%",
                    "Immediate daily cash generation cycle providing strong liquidity"
                ],
                strengths_hi=[
                    "पैतृक जमीन का उपयोग करके न्यूनतम बुनियादी ढांचा लागत",
                    "पारिवारिक श्रम द्वारा मजदूरी लागत में 40% तक की बचत",
                    "दैनिक नकदी प्रवाह जो रोजमर्रा की तरलता बनाए रखता है"
                ],
                strengths_mr=[
                    "स्वतःच्या जागेत गोठा उभारल्याने जागेचे भाडे शून्य",
                    "कुटुंबातील सदस्यांच्या मदतीमुळे मजुरी खर्चात ४०% बचत",
                    "दररोज रोख उत्पन्न मिळणारा खात्रीशीर व्यवसाय"
                ],
                weaknesses=[
                    "Lack of on-farm bulk refrigeration unit requiring prompt morning/evening delivery",
                    "Sensitivity to initial animal acclimatization and breeding cycle management"
                ],
                weaknesses_hi=[
                    "फार्म पर कोल्ड स्टोरेज न होने के कारण तुरंत वितरण की अनिवार्यता",
                    "पशुओं के प्रारंभिक रख-रखाव और गर्भाधान चक्र का प्रबंधन"
                ],
                weaknesses_mr=[
                    "गोठ्यावर स्वतंत्र शीतकरण यंत्रणा नसल्याने लगेच दूध पोहोचवणे आवश्यक",
                    "जनावरांचे लसीकरण व वेळेवर गाभण राहण्याचे व्यवस्थापन"
                ],
                opportunities=[
                    "Value-addition into Ghee and Khoa during festival seasons with 45%+ gross margins",
                    "Expansion into 4-6 high-yielding Murrah buffaloes or HF cows via subsidized Mudra/PMEGP loan",
                    "Biogas installation via PM-KUSUM subsidy for household fuel savings"
                ],
                opportunities_hi=[
                    "त्यौहारों में घी और खोया बनाकर 45% से अधिक मार्जिन कमाना",
                    "PMEGP/मुद्रा लोन द्वारा 4-6 उच्च नस्ल के पशुओं का विस्तार",
                    "बायोगैस संयंत्र लगाकर घरेलू ईंधन खर्च में बचत"
                ],
                opportunities_mr=[
                    "सणासुदीच्या काळात तूप, खवा व पनीर बनवून ४५% हून अधिक नफा मिळवणे",
                    "PMEGP अथवा मुद्रा कर्जातून ४ ते ६ जातिवंत जनावरांपर्यंत विस्तार",
                    "गोबर गॅस सयंत्र बसवून घरगुती गॅस खर्चात बचत"
                ],
                threats=[
                    "Seasonal dry fodder price spikes during peak summer months (March–May)",
                    "Sub-clinical mastitis and regional viral livestock outbreaks"
                ],
                threats_hi=[
                    "गर्मी के महीनों (मार्च-मई) में सूखे चारे के दामों में तेजी",
                    "थनैला रोग एवं मौसमी पशु संक्रमण का जोखिम"
                ],
                threats_mr=[
                    "उन्हाळ्यात (मार्च-मे) सुक्या चाऱ्याचे वाढणारे भाव",
                    "मस्तितिस (स्तनदाह) व साथीचे आजार उद्भवण्याचा धोका"
                ]
            )
            
            threats = [
                FeasibilityThreatItem(
                    threat_name="Feed & Fodder Price Volatility",
                    threat_name_hi="चारा एवं दाना की कीमतों में उतार-चढ़ाव",
                    threat_name_mr="चारा व पशुखाद्याच्या दरातील चढ-उतार",
                    category="SUPPLY_CHAIN",
                    severity="MEDIUM",
                    description="Concentrate cattle feed and dry fodder prices fluctuate by 15-20% seasonally.",
                    description_hi="सूखे चारे और पशु आहार की कीमतों में मौसम अनुसार 15-20% तक का उतार-चढ़ाव आता है।",
                    description_mr="उन्हाळ्यात सुका चारा आणि खाद्याच्या दरात १५ ते २० टक्क्यांपर्यंत वाढ होते.",
                    actionable_mitigation="Pre-stock dry straw and prepare silage bags during post-monsoon harvest when green fodder is inexpensive.",
                    actionable_mitigation_hi="फसल कटाई के समय सूखा चारा पहले से स्टॉक करें और साइलेज (मुरघास) बैग तैयार रखें।",
                    actionable_mitigation_mr="पीक कापणीच्या काळात सुका चारा साठवून ठेवा आणि मुरघास (Silage) तयार करून ठेवा."
                ),
                FeasibilityThreatItem(
                    threat_name="Single Buyer Payment Dependency",
                    threat_name_hi="एकल खरीदार पर अत्यधिक निर्भरता",
                    threat_name_mr="एकाच दूध खरेदीदारावर अवलंबित्व",
                    category="BUYER_DEPENDENCY",
                    severity="MEDIUM",
                    description="Relying 100% on a single private middleman risks payment delays or arbitrary fat price deductions.",
                    description_hi="केवल एक निजी व्यापारी पर निर्भर रहने से भुगतान में देरी और अनुचित कटौती का जोखिम रहता है।",
                    description_mr="केवळ एका खाजगी दूध संकलन केंद्रावर अवलंबून राहिल्यास पेमेंट उशिरा मिळण्याचा धोका असतो.",
                    actionable_mitigation="Split distribution: 60% to registered cooperative union + 40% direct to village households at higher retail price.",
                    actionable_mitigation_hi="60% दूध सहकारी समिति को दें तथा 40% सीधे ग्राहकों को फुटकर दर पर बेचें।",
                    actionable_mitigation_mr="६०% दूध अधिकृत सहकारी संघाला व ४०% दूध थेट गावातील ग्राहकांना जादा दराने विका."
                ),
                FeasibilityThreatItem(
                    threat_name="Seasonal Milk Yield Fluctuation",
                    threat_name_hi="मौसम के अनुसार दूध उत्पादन में कमी",
                    threat_name_mr="उन्हाळ्यातील दूध उत्पादनातील घट",
                    category="SEASONALITY",
                    severity="LOW",
                    description="High summer heat causes 12-18% natural reduction in daily milk lactation.",
                    description_hi="भीषण गर्मी में दुधारू पशुओं के दूध उत्पादन में 12-18% की प्राकृतिक गिरावट आती है।",
                    description_mr="कडक उन्हाळ्यामुळे जनावरांच्या दूध उत्पादनात १२ ते १८% घट होऊ शकते.",
                    actionable_mitigation="Install green agro-shade nets and provide mineral mixture with continuous cool drinking water.",
                    actionable_mitigation_hi="शेड पर ग्रीन शेड नेट लगाएं और मिनरल मिक्चर एवं ठंडा पानी उपलब्ध कराएं।",
                    actionable_mitigation_mr="गोठ्याभोवती ग्रीन शेडनेट लावा आणि जनावरांना थंड पाणी व क्षार मिश्रण (Mineral Mixture) द्या."
                )
            ]
            
            competitor_mapping = CompetitorMappingInfo(
                estimated_competitor_density="Moderate (approx. 5 micro dairy units per 1,000 households)",
                market_saturation_level_pct=24.0,
                saturation_verdict="UNDERSATURATED",
                estimated_active_units_in_block=7,
                competitive_differentiation_strategy="Provide guaranteed 7:00 AM doorstep delivery with transparent on-the-spot electronic lactometer fat reading, creating strong customer loyalty against loose unorganized vendors.",
                competitive_differentiation_strategy_hi="सुबह 7:00 बजे घर-घर समय पर डिलीवरी एवं ग्राहकों के सामने पारदर्शी फैट टेस्टिंग करके प्रतिस्पर्धा में बढ़त बनाएं।",
                competitive_differentiation_strategy_mr="सकाळी ७:०० वाजता वेळेवर घरपोच दूध पोहोचवणे आणि ग्राहकांसमोर फॅट तपासणी करून विश्वास संपादन करा."
            )
            
            product_market_value = ProductMarketValueInfo(
                recommended_unit_price="₹44.00 – ₹48.00 / Liter (Cow) | ₹58.00 – ₹65.00 / Liter (Buffalo)",
                recommended_unit_price_hi="₹44 – ₹48 / लीटर (गाय) | ₹58 – ₹65 / लीटर (भैंस)",
                recommended_unit_price_mr="₹४४ – ₹४८ / लिटर (गाय) | ₹५८ – ₹६५ / लिटर (म्हैस)",
                pricing_strategy="Value-Based Tiered Pricing (+₹4/L premium for direct household delivery over bulk dairy procurement rate)",
                pricing_strategy_hi="गुणवत्ता आधारित मूल्य निर्धारण (थोक खरीद दर से ₹4 अधिक पर सीधी खुदरा बिक्री)",
                pricing_strategy_mr="गुणवत्ता व सेवा आधारित किंमत (डेअरी दरापेक्षा ₹४ जादा दराने थेट ग्राहकांना विक्री)",
                regional_purchasing_power_tier=f"Tier-4 Rural High Liquidity ({district} agrarian agro-cluster)",
                predicted_monthly_market_value=f"₹38,000 – ₹52,000 Gross Revenue (Based on 2-3 milch animals)",
                predicted_monthly_market_value_hi="₹38,000 – ₹52,000 मासिक सकल आय (2-3 दुधारू पशुओं के आधार पर)",
                predicted_monthly_market_value_mr="₹३८,००० – ₹५२,००० मासिक एकूण उत्पन्न (२-३ जनावरांच्या आधारावर)",
                pricing_rationale=f"Consumers in {village} readily pay a ₹4/L premium for guaranteed fresh morning milk without water adulteration.",
                pricing_rationale_hi=f"{village} के ग्राहक बिना मिलावट वाले शुद्ध दूध के लिए ₹4 प्रति लीटर अधिक देने को सहर्ष तैयार हैं।",
                pricing_rationale_mr=f"{village} मधील ग्राहक कोणत्याही भेसळीशिवाय ताज्या दुधासाठी प्रति लिटर ₹४ जादा देण्यास तयार आहेत."
            )
            
            verdict = "EXCELLENT LOCAL FEASIBILITY — High demand, existing veterinary infrastructure, and rapid payback."
            verdict_hi="उत्कृष्ट स्थानीय व्यावहार्यता — उच्च मांग, उपलब्ध पशु चिकित्सा तंत्र और तीव्र पूंजी वापसी।"
            verdict_mr="उत्कृष्ट स्थानिक संभाव्यता — मोठी स्थानिक मागणी, उपलब्ध पशुवैद्यकीय सुविधा आणि कमी कालावधीत भांडवल परतफेड."

        else:
            # Generic agro / micro-enterprise feasibility template
            market_reach = MarketReachInfo(
                radius_km="5 – 10 km (Gram Panchayat Cluster)",
                estimated_consumer_base=surrounding_consumer_base,
                consumer_base_description=f"Immediate market of ~{surrounding_consumer_base:,} village residents, farming households, and local retail outlets across {village} block.",
                consumer_base_description_hi=f"{village} ब्लॉक के अंतर्गत लगभग {surrounding_consumer_base:,} ग्रामीणों एवं किसान परिवारों का सीधा उपभोक्ता क्षेत्र।",
                consumer_base_description_mr=f"{village} परिसरातील सुमारे {surrounding_consumer_base:,} ग्रामीण नागरिक व शेतकरी कुटुंबांचा थेट ग्राहक वर्ग.",
                primary_distribution_channels=[
                    "Direct retail sales from village unit premises",
                    "Wholesale supply to local village kirana shops",
                    "Weekly rural haat market stall"
                ],
                primary_distribution_channels_hi=[
                    "गाँव की दुकान/इकाई से सीधी बिक्री",
                    "स्थानीय किराना दुकानों को थोक आपूर्ति",
                    "साप्ताहिक ग्रामीण हाट में स्टॉल"
                ],
                primary_distribution_channels_mr=[
                    "स्वतःच्या युनिटवरून थेट किरकोळ विक्री",
                    "गावातील किराणा दुकानांना घाऊक पुरवठा",
                    "साप्ताहिक बाजारात विक्री स्टॉल"
                ],
                market_connectivity_rating="HIGH" if mkt_dist <= 6.0 else "MODERATE"
            )
            
            opportunity_analysis = OpportunityAnalysisInfo(
                unserved_niches=[
                    f"Direct farm-gate processing in {village} to reduce travel to distant town markets",
                    "On-demand custom service with digital UPI payment options"
                ],
                unserved_niches_hi=[
                    f"{village} में स्थानीय स्तर पर प्रसंस्करण ताकि दूर शहर न जाना पड़े",
                    "डिजिटल यूपीआई भुगतान के साथ ऑन-डिमांड सेवा"
                ],
                unserved_niches_mr=[
                    f"{village} मध्ये स्थानिक प्रक्रिया युनिट जेणेकरून शहरात जाण्याचा वेळ वाचेल",
                    "डिजिटल UPI पेमेंटसह तत्पर ग्राहक सेवा"
                ],
                high_potential_market_gap=f"Farmers and families in {village} currently travel {mkt_dist:.1f} km to access these processing and commercial services.",
                high_potential_market_gap_hi=f"{village} के ग्रामीणों को इस सेवा हेतु वर्तमान में {mkt_dist:.1f} किमी दूर जाना पड़ता है।",
                high_potential_market_gap_mr=f"{village} मधील नागरिकांना या सेवेसाठी सध्या {mkt_dist:.1f} किमी लांब जावे लागते.",
                growth_catalysts=[
                    "PMEGP / PMFME 25%-35% credit-linked capital subsidy",
                    "Low rural rental overhead compared to city units"
                ],
                growth_catalysts_hi=[
                    "PMEGP / PMFME योजना अंतर्गत 25%-35% सब्सिडी",
                    "शहरी दुकानों की तुलना में नगण्य किराया खर्च"
                ],
                growth_catalysts_mr=[
                    "PMEGP / PMFME अंतर्गत २५% ते ३५% भांडवली अनुदान",
                    "शहराच्या तुलनेत ग्रामीण भागात नगण्य जागा भाडे"
                ]
            )
            
            swot_analysis = SWOTAnalysisInfo(
                strengths=[
                    "Local presence eliminating transport hassle for villagers",
                    "Low operational fixed costs with owned premises",
                    "Strong personal relationships with local community"
                ],
                strengths_hi=[
                    "स्थानीय उपस्थिति जिससे ग्रामीणों का आवागमन खर्च बचता है",
                    "न्यूनतम स्थिर परिचालन लागत",
                    "गाँव के लोगों के साथ व्यक्तिगत संबंध एवं विश्वास"
                ],
                strengths_mr=[
                    "स्थानिक युनिटमुळे ग्रामस्थांची वाहतूक खर्चात मोठी बचत",
                    "कमी भांडवली खर्च व स्वतःची जागा",
                    "गावातील लोकांशी थेट विश्वासाचे नाते"
                ],
                weaknesses=[
                    "Limited working capital for large bulk raw material inventory",
                    "Dependency on single-phase/three-phase rural grid power"
                ],
                weaknesses_hi=[
                    "बड़ा कच्चा माल स्टॉक करने हेतु सीमित कार्यशील पूंजी",
                    "ग्रामीण बिजली आपूर्ति पर निर्भरता"
                ],
                weaknesses_mr=[
                    "मोठा माल साठवण्यासाठी खेळत्या भांडवलाची मर्यादा",
                    "ग्रामीण भागातील वीज पुरवठ्यावर अवलंबित्व"
                ],
                opportunities=[
                    "Expanding into secondary value-added products",
                    "Supply tie-ups with neighboring Self-Help Groups (SHGs)"
                ],
                opportunities_hi=[
                    "संबंधित अन्य उत्पादों का विस्तार",
                    "स्थानीय महिला स्वयं सहायता समूहों (SHGs) के साथ अनुबंध"
                ],
                opportunities_mr=[
                    "पूरक उत्पादनांची निर्मिती करून उत्पन्न वाढवणे",
                    "स्थानिक महिला बचत गटांना (SHG) मालाचा पुरवठा"
                ],
                threats=[
                    "Raw material price volatility during off-season",
                    "Entry of low-cost industrial packaged goods from outside towns"
                ],
                threats_hi=[
                    "बेमौसम कच्चे माल के दामों में वृद्धि",
                    "बाहरी शहरों से आने वाले सस्ते ब्रांडेड सामान से प्रतिस्पर्धा"
                ],
                threats_mr=[
                    "कच्च्या मालाच्या दरातील चढ-उतार",
                    "बाहेरील शहरांमधून येणाऱ्या पॅकबंद मालाची स्पर्धा"
                ]
            )
            
            threats = [
                FeasibilityThreatItem(
                    threat_name="Raw Material Supply Seasonality",
                    threat_name_hi="कच्चे माल की मौसमी उपलब्धता",
                    threat_name_mr="कच्च्या मालाची हंगामी उपलब्धता",
                    category="SUPPLY_CHAIN",
                    severity="MEDIUM",
                    description="Agricultural raw materials peak in winter and get costlier during monsoon.",
                    description_hi="कच्चा माल कटाई के समय सस्ता और बरसात के महीनों में महंगा हो जाता है।",
                    description_mr="हंगामात कच्चा माल मुबलक मिळतो पण पावसाळ्यात भाव वाढतात.",
                    actionable_mitigation="Establish direct forward contracts with 4-5 local grower farmers during harvest season.",
                    actionable_mitigation_hi="कटाई के समय 4-5 स्थानीय किसान उत्पादकों से सीधा अनुबंध करें।",
                    actionable_mitigation_mr="कापणीच्या वेळी ४-५ स्थानिक शेतकऱ्यांशी थेट खरेदीचा करार करा."
                ),
                FeasibilityThreatItem(
                    threat_name="Grid Power Fluctuations",
                    threat_name_hi="बिजली आपूर्ति में व्यवधान",
                    threat_name_mr="वीज पुरवठ्यातील अनियमितता",
                    category="SUPPLY_CHAIN",
                    severity="LOW",
                    description=f"Village experiences {power_hrs} hours average daily power.",
                    description_hi=f"गाँव में प्रतिदिन औसतन {power_hrs} घंटे बिजली उपलब्ध रहती है।",
                    description_mr=f"गावात दररोज सरासरी {power_hrs} तास वीज उपलब्ध असते.",
                    actionable_mitigation="Plan intensive machine batch processing during peak morning power hours (7 AM - 1 PM).",
                    actionable_mitigation_hi="मशीन का मुख्य कार्य सुबह 7 से 1 बजे के बिजली घंटों में पूरा करें।",
                    actionable_mitigation_mr="मशीनचे मुख्य काम सकाळी ७ ते दुपारी १ या खात्रीशीर वीज वेळेत पूर्ण करा."
                )
            ]
            
            competitor_mapping = CompetitorMappingInfo(
                estimated_competitor_density="Low (1–2 small units in 8 km radius)",
                market_saturation_level_pct=16.0,
                saturation_verdict="UNDERSATURATED",
                estimated_active_units_in_block=3,
                competitive_differentiation_strategy="Offer transparent weight measurement, clean packaging, and instant WhatsApp ordering for village customers.",
                competitive_differentiation_strategy_hi="सटीक तौल, स्वच्छ पैकेजिंग और व्हाट्सएप पर त्वरित ऑर्डर सुविधा दें।",
                competitive_differentiation_strategy_mr="अचूक वजन, स्वच्छ पॅकिंग आणि व्हॉट्सॲपवर ऑर्डर घेण्याची सुविधा द्या."
            )
            
            product_market_value = ProductMarketValueInfo(
                recommended_unit_price="Competitive local pricing aligned with regional retail benchmarks",
                recommended_unit_price_hi="स्थानीय बाजार भाव के अनुरूप प्रतिस्पर्धी मूल्य",
                recommended_unit_price_mr="स्थानिक बाजारभावानुसार योग्य व रास्त दर",
                pricing_strategy="Cost-Plus 20-30% Gross Margin Strategy",
                pricing_strategy_hi="लागत + 20-30% सकल लाभ नीति",
                pricing_strategy_mr="उत्पादन खर्च + २० ते ३०% नफा सूत्र",
                regional_purchasing_power_tier=f"Tier-4 Rural Growth Economy ({district})",
                predicted_monthly_market_value=f"₹{business.get('typical_revenue_monthly', 45000):,.0f} Gross Revenue / Month",
                predicted_monthly_market_value_hi=f"₹{business.get('typical_revenue_monthly', 45000):,.0f} मासिक सकल बिक्री",
                predicted_monthly_market_value_mr=f"₹{business.get('typical_revenue_monthly', 45000):,.0f} मासिक एकूण विक्री",
                pricing_rationale="Locally processed goods command steady repeat demand due to freshness and zero transportation surcharge.",
                pricing_rationale_hi="ताजगी और शून्य परिवहन लागत के कारण स्थानीय उत्पाद की निरंतर मांग रहती है।",
                pricing_rationale_mr="ताजेपणा आणि वाहतूक खर्चाची बचत यामुळे स्थानिक मालाला बारमाही मागणी राहते."
            )
            
            verdict = "VIABLE & PROFITABLE — Strong local demand with minimal direct competition."
            verdict_hi="लाभदायक एवं व्यावहारिक — मजबूत स्थानीय मांग और नगण्य सीधी प्रतिस्पर्धा।"
            verdict_mr="फायदेशीर व व्यवहार्य — चांगली स्थानिक मागणी आणि कमी स्पर्धा."

        return BusinessFeasibilityReport(
            feasibility_id=feasibility_id,
            business_id=biz_id,
            business_name=biz_name,
            business_name_hi=biz_hi,
            business_name_mr=biz_mr,
            location_id=loc_id,
            village_name=village,
            district=district,
            state=state,
            suitability_score=87.0 if biz_code == "DAIRY_FARMING" else 78.0,
            market_reach=market_reach,
            opportunity_analysis=opportunity_analysis,
            swot_analysis=swot_analysis,
            threats=threats,
            competitor_mapping=competitor_mapping,
            product_market_value=product_market_value,
            overall_feasibility_verdict=verdict,
            overall_feasibility_verdict_hi=verdict_hi,
            overall_feasibility_verdict_mr=verdict_mr
        )
