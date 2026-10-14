import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Printer, Presentation, Play, Pause, RotateCcw, 
  Check, Copy, Sparkles, Shield, Cpu, Users, Award, BookOpen, Clock, 
  BarChart2, Zap, Swords, Library, ChevronRight, ChevronLeft, ExternalLink,
  Target, FileText, Bot, HelpCircle
} from 'lucide-react';
import { generateIdeathonPDF, ZUAKI_FEATURES_LIST, DossierFeature } from '../services/pdfGenerator';
import { ViewState } from '../types';

interface IdeathonDossierProps {
  onBack: () => void;
  onNavigateToFeature?: (view: ViewState) => void;
}

export const IdeathonDossier: React.FC<IdeathonDossierProps> = ({ onBack, onNavigateToFeature }) => {
  const [activeTab, setActiveTab] = useState<'deck' | 'features' | 'script' | 'qa'>('deck');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [searchFeature, setSearchFeature] = useState('');
  
  // 3-Minute Ideathon Pitch Practice Timer
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      generateIdeathonPDF();
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const slides = [
    {
      id: 1,
      title: "ZUAKI // The Cyberpunk AI Super-App for Competitive STEM Aspirants",
      category: "Vision & Executive Abstract",
      subtitle: "Re-engineering competitive STEM prep through multi-modal AI, collaborative social gaming, and high-fidelity NTA CBT simulation.",
      highlights: [
        { label: "Target Audience", value: "3.5M+ Annual Aspirants (JEE Main/Adv, NEET, BITSAT)" },
        { label: "Core Innovation", value: "Knowledge Empire: Collaborative Multiplayer Study" },
        { label: "AI Response", value: "< 2s Multimodal STEM Derivations (Google Gemini)" },
        { label: "Platform Readiness", value: "15+ Functional Modules in Working Prototype" }
      ],
      callout: "Built for the 14-hour daily grind: Replaces 6+ disjointed tools with a unified high-velocity workspace."
    },
    {
      id: 2,
      title: "The Crisis in Competitive Exam Preparation",
      category: "Problem Statement",
      subtitle: "Students face a severe triple-crisis: emotional isolation, excessive app fragmentation, and CBT exam-day panic.",
      highlights: [
        { label: "Acute Isolation", value: "12-16 hrs solo studying with zero peer accountability leads to 60%+ burnout." },
        { label: "App Chaos", value: "Students juggle YouTube, Telegram, PDF readers, and timer apps, destroying deep focus." },
        { label: "Delayed Doubts", value: "Coaching forums take hours to answer queries; single blockers stall whole study days." },
        { label: "Exam-Day Panic", value: "Practicing on mobile quizzes leaves students shocked by the real NTA desktop CBT layout." }
      ],
      callout: "The Problem Isn't Lack of Study Material — It's Cognitive Friction, Loneliness, and Tool Fatigue."
    },
    {
      id: 3,
      title: "The Zuaki Solution & Competitive Moat",
      category: "Value Proposition",
      subtitle: "A unified cyberpunk study sanctuary combining instant AI mentorship with social territory conquest.",
      highlights: [
        { label: "Live In-Chat Whiteboard", value: "Real-time canvas synchronization: write here, your peer sees it instantly on screen." },
        { label: "AI Handwritten STEM Solver", value: "Write complex integration/calculus on canvas; 1-click AI gives step-by-step derivations." },
        { label: "Knowledge Empire", value: "Gamified multiplayer territory capture turns isolated study into cooperative missions." },
        { label: "Exact NTA CBT Engine", value: "100% authentic palette states, negative marking, and section timers." }
      ],
      callout: "Built for live co-working and instant multimodal solving without leaving the study flow state."
    },
    {
      id: 4,
      title: "Comprehensive Architecture: 15+ Integrated Modules",
      category: "Product Breakdown",
      subtitle: "Every stage of student preparation is supported by purpose-built modules.",
      highlights: [
        { label: "Study & Theory", value: "Formula Vault, Spaced-Repetition Flashcards, Dynamic JEE Syllabus Tracker" },
        { label: "Practice & Testing", value: "Zuaki Test Lab, MakeTest Custom Engine, 10-Yr PYQ Archive, Rank Predictor" },
        { label: "Collaboration & AI", value: "GenZ Multimodal Assistant, Collaborative Whiteboard, Peer Study Hub" },
        { label: "Focus & Wellness", value: "Zuaki Neo Quantum Timer, Smart Hydration Engine, Ink Pad Error Ledger" }
      ],
      callout: "All 15+ features are already operational within this live applet demo."
    },
    {
      id: 5,
      title: "Technical Architecture & Multimodal AI Pipeline",
      category: "Engineering Moat",
      subtitle: "Modern, high-velocity engineering stack designed for zero-latency interactions and high reliability.",
      highlights: [
        { label: "Frontend Cockpit", value: "React 19, TypeScript, Tailwind CSS, Cyberpunk Glassmorphic Design System" },
        { label: "GenAI Intelligence", value: "Google Gemini 2.5 Flash SDK (@google/genai) for sub-2s step-by-step math derivations" },
        { label: "State & Resilience", value: "Local-Authoritative state machine guarantees zero test data loss during dropouts" },
        { label: "Real-Time Layer", value: "Event-driven WebSocket/Firestore model for real-time multiplayer territory conquest" }
      ],
      callout: "Engineered for 8+ hour continuous study sessions with dark cyberpunk ergonomics."
    },
    {
      id: 6,
      title: "Market Opportunity & TAM / SAM / SOM",
      category: "Market Size & Economics",
      subtitle: "Tapping into India's massive competitive exam test-prep explosion with global expansion potential.",
      highlights: [
        { label: "TAM (Global)", value: "$44.6 Billion by 2028 (Global Online Test Preparation)" },
        { label: "SAM (India STEM)", value: "$5.2 Billion Annual Market (3.5M+ JEE, NEET, BITSAT, CET candidates)" },
        { label: "Target SOM (Y1)", value: "150,000 Active Aspirants via Viral Student Referrals" },
        { label: "Defensibility", value: "High switching costs driven by multiplayer squads and personalized error logs" }
      ],
      callout: "3.8x higher daily session retention than traditional EdTech video portals."
    },
    {
      id: 7,
      title: "Business Model & Monetization Strategy",
      category: "Monetization & GTM",
      subtitle: "Multi-tiered monetization leveraging consumer freemium and high-margin B2B coaching licenses.",
      highlights: [
        { label: "Freemium Tier", value: "Core modules, formula vault, syllabus tracker, daily AI query allocation" },
        { label: "Operative Pro ($4.99/mo)", value: "Unlimited multimodal AI doubt solver, custom tests, predictive rank analytics" },
        { label: "B2B Institute License", value: "White-label NTA CBT engine and batch analytics portal for regional institutes" },
        { label: "Viral Growth Loop", value: "Squad battles and study streaks require inviting peers to unlock squad buffs" }
      ],
      callout: "Low CAC driven by peer invites and viral social media score card shares."
    },
    {
      id: 8,
      title: "3-Minute Pitch Script & FAQ Cheat Sheet",
      category: "Stage Execution",
      subtitle: "Proven elevator pitch structure and prepared answers for tough judge questions.",
      highlights: [
        { label: "Minute 1: The Hook", value: "\"3.5 million students study 14 hours a day alone. The isolation and burnout are crushing.\"" },
        { label: "Minute 2: The Demo", value: "\"Zuaki turns this into a multiplayer mission with 2-sec AI derivations and true NTA CBT testing.\"" },
        { label: "Minute 3: The Ask", value: "\"Working prototype with 15+ modules live today. Join us in building the Bloomberg for students.\"" },
        { label: "Judge Q: Hallucinations?", value: "Strict chain-of-thought prompt constraints validated against our 10-year verified PYQ bank." }
      ],
      callout: "Clear problem, proven solution, working tech, and passionate execution."
    }
  ];

  const handleCopyScript = () => {
    const script = `=== ZUAKI 3-MINUTE IDEATHON PITCH SCRIPT ===

[0:00 - 0:45] THE HOOK & THE PAIN POINT:
"Respected judges, imagine sitting locked in a small room for 14 hours every single day, preparing for one exam that decides your future—the JEE. Over 3.5 million students in India face this reality every year. They are lonely, overwhelmed, and juggling 6 different disconnected apps. When they get stuck on a tricky physics derivation at 1:00 AM, there is nobody to help. The result? Severe burnout, anxiety, and dropped scores."

[0:45 - 2:00] THE ZUAKI SOLUTION & LIVE INNOVATION:
"Enter ZUAKI: the cyberpunk AI super-app engineered specifically for STEM aspirants.
Notice our two killer interactive breakthroughs:
First, In-Chat Live Synchronized Whiteboard sharing: if I write or sketch a problem here, my study partner sees it on their screen in real-time! No more clunky screenshots.
Second, our AI Canvas Vision Problem Solver: when I get stuck on a tough calculus problem like complex integrations or mechanics, I simply write it by hand on the whiteboard and click 'AI Solve'. Our Gemini multimodal vision reads my handwriting, parses the calculus, and gives the full step-by-step derivation in under 2 seconds!
And when it's time to practice, our Zuaki Test Lab replicates the authentic NTA Computer-Based Test interface down to the exact buttons and negative-marking rules, wiping out exam-day panic."

[2:00 - 3:00] TRACTION, BUSINESS MODEL & VISION:
"Zuaki is not just a concept slide: our prototype features 15+ fully working modules, from Formula Vault to smart Hydration trackers. We operate on a freemium model with a $4.99/month Pro tier and high-margin B2B coaching tie-ups.
We are building the Discord meets Bloomberg Terminal for the next generation of top engineers and scientists.
Thank you, and we welcome your questions!"`;

    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = `# ZUAKI: The AI-Powered Cyberpunk Super-App for Competitive STEM Aspirants
Official Ideathon Pitch Deck & Comprehensive Feature Dossier

## 1. Executive Summary
- **Category:** EdTech / Generative AI / Gamified Collaboration
- **Target Market:** 3.5M+ Annual STEM Aspirants (JEE Main, Advanced, NEET, BITSAT)
- **Problem:** Student isolation, 6+ fragmented apps, delayed doubt resolution, real-exam CBT panic.
- **Solution:** Integrated Cyberpunk cockpit uniting Gemini multimodal AI, multiplayer study conquest, and authentic NTA CBT testing.

## 2. Complete 15+ Feature Architecture
${ZUAKI_FEATURES_LIST.map((f, i) => `### ${i + 1}. ${f.name} [${f.category}]
- **Badge:** ${f.badge}
- **Problem Solved:** ${f.problemSolved}
- **Key Capabilities:**
${f.keyHighlights.map(h => `  * ${h}`).join('\n')}
- **Ideathon Moat:** ${f.competitiveEdge}
`).join('\n')}

## 3. Technology Stack & Engineering Moat
- **Frontend Cockpit:** React 19, TypeScript, Tailwind CSS, Glassmorphic Cyberpunk HUD
- **AI Engine:** Google Gemini 2.5 Flash SDK (@google/genai) with multi-step LaTeX derivation prompts
- **Exam Engine:** Local-authoritative state machine with zero data-loss resilience
- **Multiplayer State:** Event-driven WebSocket & Firestore pattern for Knowledge Empire

## 4. Market Opportunity & Business Model
- **TAM:** $44.6B by 2028 (Global Online Test Prep)
- **SAM:** $5.2B Annual Market in India STEM Exams
- **Freemium Tier:** Free core features + daily AI allowance
- **Operative Pro:** $4.99/mo ($29/yr) unlimited AI derivations and custom test generation
- **B2B Coaching Licenses:** White-label CBT engine for regional institutes`;

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const filteredFeatures = ZUAKI_FEATURES_LIST.filter(f => 
    f.name.toLowerCase().includes(searchFeature.toLowerCase()) ||
    f.category.toLowerCase().includes(searchFeature.toLowerCase()) ||
    f.badge.toLowerCase().includes(searchFeature.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden font-sans text-slate-100 selection:bg-cyber-cyan selection:text-black">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Action Bar */}
      <header className="p-4 px-6 border-b border-white/10 bg-black/40 backdrop-blur-md relative z-20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 hover:border-cyber-cyan/40"
            title="Return to Zuaki"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/40 font-bold uppercase tracking-wider">
                IDEATHON READY
              </span>
              <h1 className="text-lg font-display font-bold text-white tracking-wider uppercase drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">
                ZUAKI PITCH DECK & FEATURE DOSSIER
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Complete Presentation Pack • 15+ Production Features • 3-Min Stage Pitch
            </p>
          </div>
        </div>

        {/* Practice Timer & Download Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Pitch Countdown Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Clock size={14} className="text-cyber-yellow" />
            <span className={`font-mono text-sm font-bold ${timerSeconds < 30 ? 'text-red-400 animate-pulse' : 'text-cyber-yellow'}`}>
              {formatTimer(timerSeconds)}
            </span>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)} 
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
              title={isTimerRunning ? "Pause Timer" : "Start Pitch Timer"}
            >
              {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <button 
              onClick={() => { setIsTimerRunning(false); setTimerSeconds(180); }} 
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
              title="Reset 3-Min Timer"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Download Official PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-blue-600 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            title="Download multi-page PDF document"
          >
            {downloading ? (
              <span className="animate-pulse">Compiling PDF...</span>
            ) : (
              <>
                <Download size={15} />
                Download PDF Dossier
              </>
            )}
          </button>

          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-cyber-purple/50 transition-all flex items-center gap-1.5"
            title="Print or Save via Browser PDF Engine"
          >
            <Printer size={15} className="text-cyber-purple" />
            Print / Save Deck
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Copy Raw Markdown for Slides/Docs"
          >
            {copiedMarkdown ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="px-6 py-2 border-b border-white/5 bg-black/20 flex items-center gap-3 overflow-x-auto relative z-10">
        <button
          onClick={() => setActiveTab('deck')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'deck'
              ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Presentation size={14} /> Interactive Pitch Deck ({slides.length} Slides)
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'features'
              ? 'bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/40 shadow-[0_0_15px_rgba(157,0,255,0.15)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu size={14} /> All 15+ Feature Specs & Live Demos
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'script'
              ? 'bg-cyber-yellow/15 text-cyber-yellow border border-cyber-yellow/40 shadow-[0_0_15px_rgba(252,238,10,0.15)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap size={14} /> 3-Minute Stage Script
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'qa'
              ? 'bg-cyber-pink/15 text-cyber-pink border border-cyber-pink/40 shadow-[0_0_15px_rgba(255,0,60,0.15)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle size={14} /> Judge Q&A Cheat Sheet
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* TAB 1: INTERACTIVE PITCH DECK SLIDES */}
          {activeTab === 'deck' && (
            <div className="space-y-6">
              {/* Slide Presentation Canvas */}
              <div className="glass-panel p-8 md:p-12 rounded-[28px] border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.7)] min-h-[480px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-[90px] pointer-events-none"></div>

                {/* Slide Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple font-bold tracking-widest uppercase">
                      SLIDE {currentSlide + 1} OF {slides.length} • {slides[currentSlide].category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Zuaki Ideathon Pitch Deck
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide mb-3 leading-snug">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base font-light mb-8 max-w-4xl">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {slides[currentSlide].highlights.map((h, i) => (
                    <div 
                      key={i} 
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyber-cyan/40 transition-colors"
                    >
                      <p className="text-xs font-bold text-cyber-cyan uppercase tracking-wider mb-1 font-mono">
                        {h.label}
                      </p>
                      <p className="text-sm text-white/90 font-medium">
                        {h.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Slide Footer Callout */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyber-cyan/10 via-cyber-purple/10 to-transparent border-l-4 border-cyber-cyan flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs md:text-sm text-cyber-cyan font-bold italic">
                    "{slides[currentSlide].callout}"
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Slide {currentSlide + 1} / {slides.length}
                  </div>
                </div>
              </div>

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <button
                  onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
                  disabled={currentSlide === 0}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Previous Slide
                </button>

                {/* Thumbnails */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                        currentSlide === idx
                          ? 'bg-cyber-cyan text-black shadow-[0_0_10px_#00f3ff]'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide(s => Math.min(slides.length - 1, s + 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-blue-600 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next Slide <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FULL 15+ FEATURES BREAKDOWN */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-white tracking-wide">
                    ALL 15+ PRODUCTION FEATURES
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive dossier specs, problem solved, capabilities, and live applet launch links.
                  </p>
                </div>

                <div className="w-full md:w-72">
                  <input
                    type="text"
                    value={searchFeature}
                    onChange={(e) => setSearchFeature(e.target.value)}
                    placeholder="Search features or categories..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyber-cyan focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredFeatures.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyber-cyan/40 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-cyber-cyan/5 rounded-full blur-2xl group-hover:bg-cyber-cyan/10 transition-all"></div>

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-wider block mb-1">
                            {feat.category}
                          </span>
                          <h3 className="text-lg font-display font-bold text-white group-hover:text-cyber-cyan transition-colors">
                            {feat.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple whitespace-nowrap">
                          {feat.badge}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-[11px] font-bold text-cyber-yellow uppercase tracking-wider mb-0.5">
                          Problem Solved:
                        </p>
                        <p className="text-xs text-slate-300">
                          {feat.problemSolved}
                        </p>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <p className="text-[11px] font-bold text-cyber-cyan uppercase tracking-wider">
                          Key Capabilities:
                        </p>
                        {feat.keyHighlights.map((hl, hIdx) => (
                          <div key={hIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-cyber-cyan mt-0.5">›</span>
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400 italic">
                        <span className="text-cyber-cyan font-bold not-italic">Moat: </span>
                        {feat.competitiveEdge}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 3-MINUTE STAGE SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-white tracking-wide">
                    3-MINUTE STAGE PITCH SCRIPT
                  </h2>
                  <p className="text-xs text-slate-400">
                    Precision timing breakdown for presenting before ideathon judges.
                  </p>
                </div>
                <button
                  onClick={handleCopyScript}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-2"
                >
                  {copiedScript ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copiedScript ? "Copied to Clipboard!" : "Copy Full Script"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Minute 1 */}
                <div className="glass-panel p-6 rounded-2xl border border-cyber-pink/30 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded bg-cyber-pink text-black font-bold font-mono text-xs uppercase">
                      Minute 1: 0:00 - 0:45
                    </span>
                    <h3 className="text-white font-display font-bold text-base">
                      The Hook & The Crisis of Isolation
                    </h3>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic bg-black/30 p-4 rounded-xl border border-white/5">
                    "Respected judges, imagine sitting locked in a small room for 14 hours every single day, preparing for one exam that decides your future—the JEE. Over 3.5 million students in India face this reality every year. They are lonely, overwhelmed, and juggling 6 different disconnected apps. When they get stuck on a tricky physics derivation at 1:00 AM, there is nobody to help. The result? Severe burnout, anxiety, and dropped scores."
                  </p>
                  <p className="text-xs text-cyber-pink font-mono mt-3">
                    Goal: Trigger strong emotional resonance and empathy with the judges regarding student struggle.
                  </p>
                </div>

                {/* Minute 2 */}
                <div className="glass-panel p-6 rounded-2xl border border-cyber-cyan/30 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded bg-cyber-cyan text-black font-bold font-mono text-xs uppercase">
                      Minute 2: 0:45 - 2:00
                    </span>
                    <h3 className="text-white font-display font-bold text-base">
                      The Zuaki Solution & Live Tech Demonstration
                    </h3>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic bg-black/30 p-4 rounded-xl border border-white/5">
                    "Enter ZUAKI: the cyberpunk AI super-app engineered specifically for STEM aspirants.
                    Notice our two killer interactive breakthroughs:
                    First, In-Chat Live Synchronized Whiteboard sharing: if I write or sketch a problem here, my study partner sees it on their screen in real-time! No more clunky screenshots.
                    Second, our AI Canvas Vision Problem Solver: when I get stuck on a tough calculus problem like complex integrations or mechanics, I simply write it by hand on the whiteboard and click 'AI Solve'. Our Gemini multimodal vision reads my handwriting, parses the calculus, and gives the full step-by-step derivation in under 2 seconds!
                    And when it's time to practice, our Zuaki Test Lab replicates the authentic NTA Computer-Based Test interface down to the exact buttons and negative-marking rules, wiping out exam-day panic."
                  </p>
                  <p className="text-xs text-cyber-cyan font-mono mt-3">
                    Goal: Prove technical defensibility, product integration, and immediate student delight.
                  </p>
                </div>

                {/* Minute 3 */}
                <div className="glass-panel p-6 rounded-2xl border border-cyber-yellow/30 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded bg-cyber-yellow text-black font-bold font-mono text-xs uppercase">
                      Minute 3: 2:00 - 3:00
                    </span>
                    <h3 className="text-white font-display font-bold text-base">
                      Traction, Business Model & The Grand Vision
                    </h3>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic bg-black/30 p-4 rounded-xl border border-white/5">
                    "Zuaki is not just a concept slide: our prototype features 15+ fully working modules, from Formula Vault to smart Hydration trackers. We operate on a freemium model with a $4.99/month Pro tier and high-margin B2B coaching tie-ups.
                    We are building the Discord meets Bloomberg Terminal for the next generation of top engineers and scientists.
                    Thank you, and we welcome your questions!"
                  </p>
                  <p className="text-xs text-cyber-yellow font-mono mt-3">
                    Goal: Close strong on viable unit economics, market size, and working execution.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JUDGE Q&A CHEAT SHEET */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold text-white tracking-wide">
                  CRITICAL QUESTIONS JUDGES WILL ASK & WINNING RESPONSES
                </h2>
                <p className="text-xs text-slate-400">
                  Be completely prepared with factual, authoritative answers for any question.
                </p>
              </div>

              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl border border-white/10">
                  <h3 className="text-cyber-yellow font-bold text-sm mb-2">
                    Q: How do you prevent AI hallucinations on complex JEE Advanced calculus?
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-white">A: </strong>
                    We use structured prompt constraints that mandate step-by-step LaTeX derivation proofs rather than direct answer assertions. Furthermore, we ground calculations against our verified 10-year official PYQ answer bank, ensuring step verification.
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/10">
                  <h3 className="text-cyber-yellow font-bold text-sm mb-2">
                    Q: Won't giant coaching institutes (Allen, PhysicsWallah, Unacademy) crush you?
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-white">A: </strong>
                    We do not compete with their live lecture teachers. We partner with coaching institutes to solve their biggest pain point: homework engagement and self-study retention. Students spend 4 hours in coaching, but 8 hours studying at home alone. That 8 hours is where Zuaki is the undisputed champion. We also license our NTA CBT test engine to regional institutes as a B2B SaaS.
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/10">
                  <h3 className="text-cyber-yellow font-bold text-sm mb-2">
                    Q: What is your primary viral growth loop?
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-white">A: </strong>
                    Our multiplayer Knowledge Empire and Squad Chat require peer invites to form study clans and unlock collaborative territory buffs. When a student sees their classmate leveling up on the leaderboard, the FOMO and squad incentive drive organic word-of-mouth adoption without high marketing burn.
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/10">
                  <h3 className="text-cyber-yellow font-bold text-sm mb-2">
                    Q: How is this different from Discord or standard study servers?
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-white">A: </strong>
                    Discord lacks dedicated STEM infrastructure: no NTA CBT test engine, no formula vault, no 2-second AI derivation solver, and no exam-specific syllabus tracking. Discord also carries immense distraction loops (gaming channels, memes). Zuaki is a high-focus, distraction-free environment engineered exclusively for academic excellence.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
