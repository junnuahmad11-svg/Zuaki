
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, UserProfile } from './types';
import { authService } from './services/authService';
import { Navigation } from './components/Navigation';
import { SidebarMenu } from './components/SidebarMenu';
import { ActiveTimeTracker } from './components/ActiveTimeTracker';
import { BottomNavigation } from './components/BottomNavigation';
import { ChatInterface } from './components/ChatInterface';
import { GenZAssistant } from './components/GeminiAssistant';
import { Dashboard } from './components/Dashboard';
import { Whiteboard } from './components/Whiteboard';
import { TodoList } from './components/TodoList';
import { SplashScreen } from './components/SplashScreen';
import { OperativeSetup } from './components/OperativeSetup';
import { FeatureShowcase } from './components/FeatureShowcase';
import { Calculator } from './components/Calculator';
import { CalculatorPopup } from './components/CalculatorPopup';
import { StudyHub } from './components/StudyHub';
import { TestSeries } from './components/TestSeries';
import { Profile } from './components/Profile';
import { EditProfile } from './components/EditProfile';
import { Leaderboard } from './components/Leaderboard';
import { Planner } from './components/Planner';
import { QuizArena } from './components/QuizArena'; 
import { RankPredictor } from './components/RankPredictor';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { Feedback } from './components/Feedback';
import { WeeklyAnalysis } from './components/WeeklyAnalysis';
import { Achievements } from './components/Achievements';
import { Notifications } from './components/Notifications';
import { Flashcards } from './components/Flashcards';
import { CalendarView } from './components/CalendarView';
import { DoubtSolver } from './components/DoubtSolver';
import { Certificate } from './components/Certificate';
import { MakeTest } from './components/MakeTest';
import { ZukaiTube } from './components/ZukaiTube';
import { MotivationalZone } from './components/MotivationalZone';
import { PYQPapers } from './components/PYQPapers';
import { FormulaVault } from './components/FormulaVault';
import { FormulaFlashcards } from './components/FormulaFlashcards';
import { TestLabDashboard } from './components/TestLabDashboard';
import { TestInstructions } from './components/TestInstructions';
import { TestInterface } from './components/TestInterface';
import { TestResultFull } from './components/TestResultFull';
import { StrengthNotes } from './components/StrengthNotes';
import { ShortNotes } from './components/ShortNotes'; 
import { ZuakiNeoTimer } from './components/ZuakiNeoTimer'; 
import { JEESyllabus } from './components/JEESyllabus'; 
import { Auth } from './components/Auth'; 
import { ZurakiBackButton } from './components/ZurakiBackButton';
import { KnowledgeEmpire } from './components/Empire/KnowledgeEmpire';
import { IdeathonDossier } from './components/IdeathonDossier';
import { Menu } from 'lucide-react';
import { firebase } from './services/backend';
import { timerService } from './services/timerService';
import { hydrationService } from './services/hydrationService';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.SPLASH);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [history, setHistory] = useState<ViewState[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [activeTestConfig, setActiveTestConfig] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
      const initApp = async () => {
          const auth = authService.getAuth();
          
          if (auth && auth.isLoggedIn) {
              try {
                  const doc = await firebase.firestore().doc(`users/${auth.zaId}`).get();
                  if (doc.exists) {
                      const data = doc.data();
                      setUserProfile(data);
                      if (data.setupCompleted) setView(ViewState.DASHBOARD);
                      else setView(ViewState.OPERATIVE_SETUP);
                  } else {
                      // Fallback: If logged in but profile missing, redo setup
                      setView(ViewState.OPERATIVE_SETUP);
                  }
              } catch(e) { 
                  console.error("Session load failed", e);
                  setView(ViewState.LOGIN);
              }
          }
          setIsInitialized(true);
      };
      initApp();
  }, []);

  // Watch Timer Status
  useEffect(() => {
    const unsub = timerService.subscribe((state) => {
      setIsTimerRunning(state.status === 'RUNNING');
    });
    return unsub;
  }, []);

  // --- HYDRATION BACKGROUND CHECKER ---
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      hydrationService.checkAndNotify(view, isTimerRunning);
    }, 60000); // Check once a minute

    return () => clearInterval(interval);
  }, [isInitialized, view, isTimerRunning]);

  const handleNavigate = useCallback((newView: ViewState) => {
      if (newView === view) return;
      setHistory(prev => [...prev, view]);
      setView(newView);
  }, [view]);

  const handleGoBack = useCallback(() => {
      if (history.length === 0) {
          if (view !== ViewState.DASHBOARD) setView(ViewState.DASHBOARD);
          return;
      }
      const prevView = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setView(prevView);
  }, [history, view]);

  const handleSplashComplete = () => {
    const auth = authService.getAuth();
    if (authService.isNewDevice()) {
        // First Install -> Onboarding
        setView(ViewState.FEATURE_SHOWCASE);
    } else if (auth && auth.isLoggedIn) {
        // Return Session -> Dashboard
        setView(ViewState.DASHBOARD);
    } else {
        // Logged Out Return -> Login
        setView(ViewState.LOGIN);
    }
  };

  const handleShowcaseComplete = () => setView(ViewState.LOGIN);
  
  const handleAuthSuccess = async (user: Partial<UserProfile>, isNewUser?: boolean) => {
      setUserProfile(prev => ({ ...prev, ...user }));
      if (isNewUser) {
          setView(ViewState.OPERATIVE_SETUP);
      } else {
          const doc = await firebase.firestore().doc(`users/${user.zaId}`).get();
          const data = doc.data();
          setUserProfile(data);
          if (data.setupCompleted) setView(ViewState.DASHBOARD);
          else setView(ViewState.OPERATIVE_SETUP);
      }
  };

  const handleLogout = () => {
    authService.logout();
    setHistory([]);
    setView(ViewState.LOGIN);
  };

  const handleProfileUpdate = (data: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    if (updated.zaId) firebase.firestore().doc(`users/${updated.zaId}`).update(data);
    if (view === ViewState.OPERATIVE_SETUP || view === ViewState.BASIC_INFO) setView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    if (!isInitialized && view !== ViewState.SPLASH) return null;
    switch (view) {
      case ViewState.CHAT: return <ChatInterface />;
      case ViewState.AI_ASSISTANT: return <GenZAssistant userProfile={userProfile} onBack={handleGoBack} />;
      case ViewState.DASHBOARD: return <Dashboard onChangeView={handleNavigate} onOpenCalc={() => setIsCalcOpen(true)} userProfileProp={userProfile} />;
      case ViewState.WHITEBOARD: return <Whiteboard />;
      case ViewState.TASKS: return <TodoList />;
      case ViewState.PLANNER: return <Planner />; 
      case ViewState.QUIZ_ARENA: return <QuizArena />; 
      case ViewState.RANK_PREDICTOR: return <RankPredictor />;
      case ViewState.CALCULATOR: return <Calculator onClose={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.STUDY_HUB: return <StudyHub onChangeView={handleNavigate} />;
      case ViewState.TEST_SERIES: return <TestSeries onChangeView={handleNavigate} />;
      case ViewState.TEST_LAB_HOME: return <TestLabDashboard onStartTest={(conf) => { setActiveTestConfig(conf); setView(ViewState.TEST_INSTRUCTIONS); }} onViewHistory={(r) => { setTestResult(r); handleNavigate(ViewState.TEST_LAB_RESULT); }} />;
      case ViewState.TEST_INSTRUCTIONS: return activeTestConfig ? <TestInstructions config={activeTestConfig} onStart={() => setView(ViewState.TEST_LAB_INTERFACE)} onCancel={handleGoBack} /> : null;
      case ViewState.TEST_LAB_INTERFACE: return activeTestConfig ? <TestInterface config={activeTestConfig} onComplete={(res) => { firebase.firestore().tests.saveResult(res); setTestResult(res); setView(ViewState.TEST_LAB_RESULT); }} onExit={handleGoBack} onOpenCalc={() => setIsCalcOpen(true)} onDirty={setIsDirty} /> : null;
      case ViewState.TEST_LAB_RESULT: return <TestResultFull result={testResult} onExit={() => setView(ViewState.TEST_LAB_HOME)} />;
      case ViewState.MAKE_TEST: return <MakeTest onBack={handleGoBack} />;
      case ViewState.LEADERBOARD: return <Leaderboard />;
      case ViewState.MOTIVATION: return <MotivationalZone />;
      case ViewState.PYQ_PAPERS: return <PYQPapers />;
      case ViewState.FORMULA_VAULT: return <FormulaVault onBack={handleGoBack} />;
      case ViewState.FORMULA_FLASHCARDS: return <FormulaFlashcards onBack={handleGoBack} />;
      case ViewState.NEO_TIMER: return <ZuakiNeoTimer />;
      case ViewState.SHORT_NOTES: return <ShortNotes />; 
      case ViewState.JEE_SYLLABUS: return <JEESyllabus onBack={handleGoBack} />;
      case ViewState.STRENGTH_NOTES: return <StrengthNotes onBack={handleGoBack} onDirty={setIsDirty} />;
      case ViewState.NOTIFICATIONS: return <Notifications />;
      case ViewState.PROFILE: return <Profile userProfile={userProfile} onUpdateProfile={handleProfileUpdate} onNavigate={handleNavigate} onLogout={handleLogout} />;
      case ViewState.EDIT_PROFILE: return <EditProfile userProfile={userProfile} onSave={handleProfileUpdate} onBack={handleGoBack} />;
      case ViewState.OPERATIVE_SETUP: return <OperativeSetup initialProfile={userProfile} onComplete={handleProfileUpdate} />;
      case ViewState.ACHIEVEMENTS: return <Achievements />;
      case ViewState.SETTINGS: return <Profile userProfile={userProfile} onUpdateProfile={handleProfileUpdate} onNavigate={handleNavigate} onLogout={handleLogout} />;
      case ViewState.FLASHCARDS: return <Flashcards />;
      case ViewState.CALENDAR: return <CalendarView />;
      case ViewState.DOUBT_SOLVER: return <DoubtSolver />;
      case ViewState.CERTIFICATE: return <Certificate userProfile={userProfile} />;
      case ViewState.ABOUT_US: return <AboutUs />;
      case ViewState.CONTACT_US: return <ContactUs />;
      case ViewState.FEEDBACK: return <Feedback />;
      case ViewState.EMPIRE: return <KnowledgeEmpire />;
      case ViewState.IDEATHON_DOSSIER: return <IdeathonDossier onBack={handleGoBack} onNavigateToFeature={handleNavigate} />;
      default: return <Dashboard onChangeView={handleNavigate} onOpenCalc={() => setIsCalcOpen(true)} userProfileProp={userProfile} />;
    }
  };

  if (view === ViewState.SPLASH) return <SplashScreen onComplete={handleSplashComplete} />;
  if (view === ViewState.FEATURE_SHOWCASE) return <FeatureShowcase onComplete={handleShowcaseComplete} />;
  if (view === ViewState.LOGIN || view === ViewState.SIGNUP) return <Auth onLoginSuccess={handleAuthSuccess} />;

  const showGlobalBack = history.length > 0 && ![ViewState.DASHBOARD, ViewState.TEST_LAB_INTERFACE, ViewState.AI_ASSISTANT, ViewState.OPERATIVE_SETUP, ViewState.QUIZ_ARENA, ViewState.EMPIRE, ViewState.IDEATHON_DOSSIER].includes(view);

  return (
    <div className="h-screen w-screen bg-[#020617] flex text-white relative overflow-hidden font-sans selection:bg-cyber-cyan selection:text-black">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#02020a_100%)] opacity-80 z-0"></div>
      <ActiveTimeTracker />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onChangeView={handleNavigate} userProfile={userProfile} />
      {isCalcOpen && <CalculatorPopup onClose={() => setIsCalcOpen(false)} />}
      <div className="hidden lg:block z-50 h-full relative">
         <Navigation currentView={view} onChangeView={handleNavigate} onLogout={handleLogout} userProfile={userProfile} />
      </div>
      <main className="flex-1 h-full relative z-10 flex flex-col items-center">
        <div className="lg:hidden fixed top-6 left-6 z-[60] flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg"><Menu size={20} /></button>
             {showGlobalBack && <ZurakiBackButton onClick={handleGoBack} />}
        </div>
        {showGlobalBack && <div className="hidden lg:block absolute top-6 left-6 z-[60]"><ZurakiBackButton onClick={handleGoBack} label="Back" /></div>}
        <div className="flex-1 w-full overflow-hidden relative flex justify-center">
             <div className="w-full h-full">{renderContent()}</div>
        </div>
        <BottomNavigation currentView={view} onChangeView={handleNavigate} />
      </main>
    </div>
  );
};

export default App;
