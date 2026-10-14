

export enum ViewState {
  SPLASH = 'SPLASH',
  FEATURE_SHOWCASE = 'FEATURE_SHOWCASE',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP', 
  AVATAR_SELECT = 'AVATAR_SELECT',
  OPERATIVE_SETUP = 'OPERATIVE_SETUP',
  BASIC_INFO = 'BASIC_INFO',
  CHAT = 'CHAT',
  AI_ASSISTANT = 'AI_ASSISTANT',
  DASHBOARD = 'DASHBOARD',
  WHITEBOARD = 'WHITEBOARD', 
  WHITEBOARD_EDITOR = 'WHITEBOARD_EDITOR', 
  TASKS = 'TASKS',
  CALCULATOR = 'CALCULATOR',
  STUDY_HUB = 'STUDY_HUB', 
  TEST_SERIES = 'TEST_SERIES', 
  TEST_RUNNER = 'TEST_RUNNER', 
  TEST_ANALYSIS = 'TEST_ANALYSIS', 
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  PLANNER = 'PLANNER',
  DAILY_FOCUS = 'DAILY_FOCUS',
  QUIZ_ARENA = 'QUIZ_ARENA',
  ANALYSIS = 'ANALYSIS',
  RANK_PREDICTOR = 'RANK_PREDICTOR',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SETTINGS = 'SETTINGS',
  ABOUT_US = 'ABOUT_US',
  CONTACT_US = 'CONTACT_US',
  FEEDBACK = 'FEEDBACK',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  FLASHCARDS = 'FLASHCARDS', 
  FORMULA_FLASHCARDS = 'FORMULA_FLASHCARDS', 
  NEO_TIMER = 'NEO_TIMER', 
  SHORT_NOTES = 'SHORT_NOTES', 
  CALENDAR = 'CALENDAR',
  DOUBT_SOLVER = 'DOUBT_SOLVER',
  CERTIFICATE = 'CERTIFICATE',
  MAKE_TEST = 'MAKE_TEST', 
  ZUKAI_TUBE = 'ZUKAI_TUBE',
  MOTIVATION = 'MOTIVATION',
  PYQ_PAPERS = 'PYQ_PAPERS',
  FORMULA_VAULT = 'FORMULA_VAULT',
  JEE_SYLLABUS = 'JEE_SYLLABUS', 
  TEST_LAB_HOME = 'TEST_LAB_HOME',
  TEST_INSTRUCTIONS = 'TEST_INSTRUCTIONS', 
  TEST_LAB_INTERFACE = 'TEST_LAB_INTERFACE',
  TEST_LAB_RESULT = 'TEST_LAB_RESULT',
  STRENGTH_NOTES = 'STRENGTH_NOTES',
  EMPIRE = 'EMPIRE',
  IDEATHON_DOSSIER = 'IDEATHON_DOSSIER'
}

/* User Identity and Settings */
export interface UserProfile {
  zaId: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  joinedDate: string;
  setupCompleted: boolean;
  studentClass?: '11' | '12' | 'Dropper';
  examMode?: 'JEE' | 'NEET';
  language?: 'English' | 'Hindi' | 'Telugu';
  aiVoice?: 'Male' | 'Female';
  gender?: 'Male' | 'Female' | 'Prefer not to say';
  xpTarget?: number;
  mainGoal?: string;
  college?: string;
  phone?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  aiTone: string;
  privacyMode: boolean;
  theme: string;
  studyMode: boolean;
  aiVoiceType?: 'male' | 'female';
}

export interface LocalAuth {
  zaId: string;
  email: string;
  createdAt: number;
  lastLogin: number;
  isLoggedIn: boolean;
}

/* Empire Feature */
export interface EmpireFloor {
  id: string;
  name: string;
  mastery: number; 
  status: 'LOCKED' | 'ACTIVE' | 'WEAK' | 'MASTERED';
  stability: number;
}

export interface EmpireBuilding {
  id: string;
  subject: string;
  level: number;
  floors: EmpireFloor[];
  unlocked: boolean;
}

export interface ZuakiCard {
  id: string;
  title: string;
  quote: string;
  rarity: 'COMMON' | 'ELITE' | 'MYTHIC';
  unlockedAt?: number;
}

export interface EmpireState {
  brainCoins: number;
  empireLevel: number;
  rank: number;
  buildings: EmpireBuilding[];
  activeManagers: string[];
  hasSeenTutorial: boolean;
  collectedCards: string[];
}

/* Question and Assessments */
export interface Question {
  id: string;
  year?: number;
  session?: string;
  shift?: number;
  text: string; 
  image?: string;
  type: 'MCQ' | 'NUMERICAL' | 'INTEGER';
  options?: string[]; 
  correctAnswer: string | number; 
  explanation: string;
  solutionSteps?: string; 
  formulaUsed?: string[];
  commonMistake?: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  chapter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced' | 'Moderate';
  tag?: string;
}

/* User Statistics and History */
export interface UserStats {
  level: number;
  xp: number;
  dailyStreak: number;
  lastStudyDate: string | null;
  dailyTime: number;   
  weeklyTime: number;  
  totalTime: number;   
  studyTimeHours: number;
  studyHistory: StudyDay[];
  subjectTimes: Record<string, number>; 
  avgFocusSession: number; 
  avgBreakLength: number; 
  sessionsCount: number;
  weeklyProgress: number;
  quizzesAttempted: number;
  pyqsAttempted: number;
  customTestsAttempted: number;
  accuracy: number;
  aiDoubtsAsked: number;
  rankEstimate: number;
  rankRange?: string; 
  tasksCompleted: number;
  rewardsTotal: number;
  rewardsClaimed: number;
  weakSubjects: string[];
  strongSubjects: string[];
  bookmarkedQuestions?: string[]; 
  arenaWins: number;
  arenaLosses: number;
  botWins: number;
  botLosses: number;
  bestRank?: number;
  avgAccuracy?: number;
}

/* Chat and Communication */
export interface Message {
  id: string;
  sender: 'me' | 'them';
  senderName?: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'voice';
  isEmergency?: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: string;
  unread: number;
  type: 'friend';
}

export interface Group {
  id: string;
  name: string;
  icon?: string;
  avatar?: string;
  inviteCode: string;
  memberCount: number;
  type: 'group';
  lastMessage?: string;
  unread: number;
}

export interface GroupMessage {
  text: string;
  senderName: string;
  type: 'text' | 'image' | 'voice';
}

export interface FriendRequest {
  id: string;
  from: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
}

export interface Attachment {
  id: string;
  url: string;
  base64: string;
  mimeType: string;
  name: string;
  type: 'image' | 'file';
}

/* Notes and Whiteboard */
export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'whiteboard';
  color: NoteColor;
  labels: string[];
  isPinned: boolean;
  isArchived: boolean;
  isStarred: boolean;
  createdAt: number;
  updatedAt?: number;
  checklist?: { text: string; checked: boolean }[];
  whiteboardPages?: WhiteboardPage[];
  subject?: string;
  chapter?: string;
}

export interface WhiteboardPage {
  id: string;
  strokes: WhiteboardStroke[];
  thumbnail?: string;
}

export interface WhiteboardStroke {
  points: StrokePoint[];
  color: string;
  width: number;
  type: 'pen' | 'eraser' | 'highlighter' | 'line' | 'rect' | 'circle' | 'arrow';
}

export interface StrokePoint {
  x: number;
  y: number;
}

/* General Study Utilities */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
  subject: string;
}

export interface FormulaChapter {
  id: string;
  title: string;
  subject: string;
  sections: { title: string; content: string[]; note?: string }[];
}

export interface TestConfig {
  id: string;
  title: string;
  type: 'MOCK' | 'CHAPTER' | 'PYQ';
  subjects: string[];
  duration: number;
  questionCount: number;
  questions: Question[];
  year?: number;
  session?: string;
  shift?: number;
}

export interface ShortNote {
  id: string;
  subject: string;
  chapter: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  uploadedAt: number;
}

export interface FullChapterNote {
  title: string;
  subject: string;
  sections: {
    heading: string;
    content: string;
    subsections?: { title: string; text: string }[];
  }[];
  formulas: { name: string; eq: string }[];
  ncertPoints: string[];
  examInsights: {
    weightage: string;
    commonMistakes: string[];
    questionTypes?: string[];
  };
}

export interface VideoResource {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
}

export interface PYQPaper {
  id: string;
  year: number;
  session: string;
  shift: string;
  subject: string;
  uploadedAt: number;
  isGenerated?: boolean;
}

export interface NTAUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'CRITICAL' | 'IMPORTANT' | 'INFO';
  link: string;
  isRead?: boolean;
}

export interface FeedbackSubmission {
  type: 'Bug' | 'Feature' | 'Suggestion' | 'Other';
  message: string;
  screenshot?: string;
  userId: string;
  userName: string;
  deviceInfo: string;
  appVersion: string;
  timestamp: number;
}

export interface TestResult {
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  percentile: number;
  rank: number;
  date: string;
  subjectWise: Record<string, { score: number; total: number; time: number }>;
  answers: Record<string, any>;
  status: Record<string, string>;
  questionTime: Record<string, number>;
  xpEarned?: number;
  rankRange?: string;
  testType?: string;
  chapterAnalysis?: ChapterPerformance[];
  questions?: Question[];
}

export interface ChapterPerformance {
  name: string;
  accuracy: number;
  avgTime: number;
  status: 'Strong' | 'Weak' | 'Average';
}

export interface StudyDay {
  day: string;
  date: string;
  seconds: number;
  subjectBreakdown?: Record<string, number>;
}

/* System Notifications */
export type NotificationCategory = 'MISSION' | 'PERFORMANCE' | 'UPDATE' | 'AVATAR';

export interface ZuakiNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  deepLink: string;
  timestamp: number;
  read: boolean;
}

/* Flashcards and Motivation */
export interface Flashcard {
  id: string;
  classLevel: string;
  subject: string;
  chapter: string;
  front: string;
  back: string;
  mastered: boolean;
}

export interface MotivationalStory {
  id: string;
  name: string;
  photo: string;
  iit: string;
  branch: string;
  background: string;
  hook: string;
  struggles: string;
  turningPoint: string;
  routine: string;
  achievement: string;
  takeaway: string;
}

export interface FormulaTopic {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  chapter: string;
  topic: string;
  cards: FormulaCard[];
}

export interface FormulaCard {
  id: string;
  front: string;
  back: string;
  explanation: string;
  mastered: boolean;
  starred: boolean;
  example?: string;
}

/* Timer and Productivity */
export interface QuantumSession {
  id: string;
  timestamp: number;
  duration: number;
  subject: string;
  task: string;
  mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
  xpEarned: number;
}

export interface QuantumConfig {
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'CYAN' | 'PURPLE' | 'GOLD';
}

/* JEE Syllabus Mapping */
export interface SyllabusSubject {
  id: 'Physics' | 'Chemistry' | 'Maths';
  chapters: SyllabusChapter[];
}

export interface SyllabusChapter {
  id: string;
  name: string;
  weightage: 'High' | 'Medium' | 'Low';
  status: 'AVAILABLE' | 'COMING_SOON';
  topics: SyllabusTopic[];
  category?: 'Physical' | 'Inorganic' | 'Organic';
}

export interface SyllabusTopic {
  name: string;
  concept: string;
  examPatterns: string[];
  tags: string[];
}
