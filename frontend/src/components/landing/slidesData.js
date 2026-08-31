/**
 * GramNiti AI Landing Page Slide Configuration
 * Single centralized array of all 5 slide visual assets, titles, descriptions,
 * accessibility alt texts, and interactive target actions.
 */

export const SLIDES_DATA = [
  {
    id: 1,
    title: "Empowering Villages with AI",
    subtitle: "Discover schemes, services and opportunities — simplified for every rural citizen.",
    image: "/images/gramniti-slide-1.jpg",
    fallbackImage: "/images/gramniti-slide-1.jpg",
    alt: "GramNiti AI Hero Slide: Empowering Villages with AI - Discover schemes, services and opportunities simplified for rural citizens",
    badge: "Smart Governance • Empowered Villages",
    tagline: "AI-driven guidance • Local Intelligence • Financial Clarity • Inclusive Growth",
    actionTab: "advisor",
    actionLabel: "Explore GramNiti",
    secondaryLabel: "How It Works",
    pillars: [
      { name: "Local Intelligence", desc: "Discover hyper-local market opportunities and verified government schemes." },
      { name: "Scheme Guidance", desc: "AI-powered eligibility matching and official subsidy calculation." },
      { name: "Financial Planning", desc: "Transparent project cost breakdown and easy bank loan structuring." }
    ]
  },
  {
    id: 2,
    title: "Bridging the Rural Information Gap",
    subtitle: "Millions of rural citizens and entrepreneurs struggle to find, understand, and access government support.",
    image: "/images/gramniti-slide-2.jpg",
    fallbackImage: "/images/gramniti-slide-2.jpg",
    alt: "GramNiti AI Problem Slide: Information is scattered, Complex government schemes, Language barriers, Limited digital accessibility",
    badge: "The Rural Challenge",
    tagline: "Solving critical informational and accessibility bottlenecks in rural India",
    actionTab: "advisor",
    actionLabel: "See Solutions",
    pillars: [
      { name: "Information is Scattered", desc: "Fragmented portals and outdated circulars make discovery difficult." },
      { name: "Complex Government Schemes", desc: "Complicated documentation requirements and eligibility criteria." },
      { name: "Language Barriers", desc: "Lack of regional language support and conversational assistance." },
      { name: "Limited Digital Accessibility", desc: "Need for simplified, voice-enabled, mobile-first design." }
    ]
  },
  {
    id: 3,
    title: "One Platform. Smarter Access.",
    subtitle: "GramNiti AI acts as the intelligent bridge connecting rural citizens directly with verified government schemes and local opportunities.",
    image: "/images/gramniti-slide-3.jpg",
    fallbackImage: "/images/gramniti-slide-3.jpg",
    alt: "GramNiti AI Solution Slide: Citizen -> GramNiti AI Engine -> Personalized Information -> Government Services & Schemes",
    badge: "The Core Innovation",
    tagline: "Citizen ➔ GramNiti AI Engine ➔ Personalized Guidance ➔ Government Services",
    actionTab: "dashboard",
    actionLabel: "Open Citizen Dashboard",
    pillars: [
      { name: "AI-Powered Scheme Discovery", desc: "Automatic matching with 1000+ central and state schemes." },
      { name: "Multilingual & Voice Assistance", desc: "Full support across 13 Indian languages with speech readout." },
      { name: "Hyper-Local Feasibility", desc: "5–10 km village catchment analytics and SWOT viability." },
      { name: "Simple Citizen Dashboard", desc: "Connected 9-step decision pathway for every entrepreneur." }
    ]
  },
  {
    id: 4,
    title: "From Citizen Query to Action",
    subtitle: "A streamlined end-to-end data pipeline converting simple citizen inquiries into verified government benefits.",
    image: "/images/gramniti-slide-4.jpg",
    fallbackImage: "/images/gramniti-slide-4.jpg",
    alt: "GramNiti AI Architecture: User Query -> AI Understanding -> Government Data -> Recommendation -> Action / DPR",
    badge: "How It Works • Platform Pipeline",
    tagline: "User Query ➔ AI Understanding ➔ Govt Data ➔ Recommendation ➔ Action / DPR",
    actionTab: "action-plan",
    actionLabel: "Generate AI-Assisted DPR",
    pillars: [
      { name: "Citizen Access Portal", desc: "Mobile-first, voice-enabled interface for simplified village adoption." },
      { name: "Policy & Subsidy Engine", desc: "Deterministic calculations ensuring accurate, zero-error subsidy math." },
      { name: "Verified Scheme Registry", desc: "Directly integrated with official Central and State datasets." },
      { name: "Multilingual Voice AI", desc: "Real-time natural speech and text assistance in 13 Indian languages." }
    ]
  },
  {
    id: 5,
    title: "Building Smarter, More Empowered Villages",
    subtitle: "Catalyzing inclusive rural growth, financial self-reliance, and transparent governance across India.",
    image: "/images/gramniti-slide-5.jpg",
    fallbackImage: "/images/gramniti-slide-5.jpg",
    alt: "GramNiti AI Impact Slide: Better Scheme Awareness, Faster Access to Services, Inclusive Multilingual Access, Data-Driven Rural Growth",
    badge: "Measurable Real-World Impact",
    tagline: "Smart Governance. Empowered Villages.",
    actionTab: "dashboard",
    actionLabel: "Empower Your Village with GramNiti AI",
    pillars: [
      { name: "Better Scheme Awareness", desc: "75%+ boost in rural scheme discovery and accurate utilization." },
      { name: "Faster Access to Services", desc: "Instant eligibility verification and 90% loan structuring." },
      { name: "Inclusive Multilingual Access", desc: "Voice-first support across 13 official Indian languages." },
      { name: "Data-Driven Rural Growth", desc: "Sustainable livelihood creation and transparent governance." }
    ]
  }
];
