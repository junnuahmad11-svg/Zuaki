
import {
  Group,
  GroupMessage,
  UserProfile,
  FormulaChapter,
  TestConfig,
  Question,
  Note,
  ShortNote,
  VideoResource,
  PYQPaper,
  NTAUpdate,
  FeedbackSubmission,
  TestResult
} from "../types";
import { GoogleGenAI, Type } from "@google/genai";
import { JEE_DATASET } from "../data/jee_2025";
import { JEE_PYQ_DATA_2020_2025 } from "../data/jee_pyqs_archive";

const DB = {
  get: (collection: string) => {
    try {
      return JSON.parse(localStorage.getItem(`zuaki_${collection}`) || "[]");
    } catch {
      return [];
    }
  },
  set: (collection: string, data: any[]) => {
    localStorage.setItem(`zuaki_${collection}`, JSON.stringify(data));
  },
  add: (collection: string, item: any) => {
    const data = DB.get(collection);
    data.push(item);
    DB.set(collection, data);
    return item;
  },
  find: (collection: string, predicate: (item: any) => boolean) => {
    return DB.get(collection).find(predicate);
  },
  filter: (collection: string, predicate: (item: any) => boolean) =>
    DB.get(collection).filter(predicate),
};

const extractJsonArray = (text: string) => {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end >= start) {
    return text.substring(start, end + 1);
  }
  return text;
};

export const nta = {
  getUnreadCount: async () => {
    const news = await nta.fetchUpdates();
    return news.filter(n => !n.isRead).length;
  },
  fetchUpdates: async (): Promise<NTAUpdate[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Find the 5 most recent official NTA (National Testing Agency) announcements specifically for JEE Main 2025. 
        Format your response EXCLUSIVELY as a JSON array of objects with keys: id, title, description, date (YYYY-MM-DD), type (CRITICAL, IMPORTANT, or INFO), and link.
        Ensure these are real, live updates from nta.ac.in.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                date: { type: Type.STRING, description: "Format: YYYY-MM-DD" },
                type: { type: Type.STRING, description: "One of: CRITICAL, IMPORTANT, INFO" },
                link: { type: Type.STRING }
              },
              required: ["id", "title", "description", "date", "type"]
            }
          }
        }
      });

      const rawText = response.text || "[]";
      // Robust extraction to handle potential conversational noise from search grounding
      const jsonText = extractJsonArray(rawText);
      
      let updates: NTAUpdate[] = JSON.parse(jsonText);
      const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return updates.map((u, i) => ({
        ...u,
        link: u.link || (groundingLinks[0] as any)?.web?.uri || 'https://jeemain.nta.ac.in',
        isRead: localStorage.getItem(`zuaki_read_nta_${u.id}`) === 'true'
      }));
    } catch (error) {
      console.error("NTA Sync Error:", error);
      throw new Error("Neural data stream interrupted. Could not fetch live NTA news.");
    }
  },
  markRead: (id: string) => {
    localStorage.setItem(`zuaki_read_nta_${id}`, 'true');
  }
};

export const imagekit = {
  uploadFile: async (base64: string) => "https://picsum.photos/200"
};

export const vercel = {
  api: {
    whiteboardSocket: (groupId: string) => {}
  }
};

const parseISO8601Duration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const youtube = {
  searchVideos: async (query: string): Promise<VideoResource[]> => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      console.error("YouTube API integration requires a valid API key.");
      return [];
    }

    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
      );
      const searchData = await searchRes.json();

      if (!searchData.items || searchData.items.length === 0) return [];

      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
      );
      const detailsData = await detailsRes.json();

      const durationMap: Record<string, string> = {};
      detailsData.items.forEach((item: any) => {
        durationMap[item.id] = parseISO8601Duration(item.contentDetails.duration);
      });

      return searchData.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        channel: item.snippet.channelTitle,
        duration: durationMap[item.id.videoId] || "0:00"
      }));
    } catch (error) {
      console.error("YouTube search error:", error);
      return [];
    }
  }
};

export const firebase = {
  auth: () => ({
    signInWithGoogle: async () => ({ 
      user: { userId: 'ZA-12345', name: 'Zubair', setupCompleted: false }, 
      token: 'abc', 
      isNewUser: false,
      googleUid: 'g123',
      email: 'zubair@zuaki.ai',
      photoUrl: ''
    }),
    signInWithCredentials: async (e: string, p: string) => ({ user: { userId: 'ZA-12345', name: 'Zubair', setupCompleted: true }, token: 'abc' }),
    signUp: async (d: any) => ({ user: { userId: 'ZA-12345', name: d.name, setupCompleted: false }, token: 'abc' })
  }),
  firestore: () => ({
    doc: (path: string) => ({
      get: async () => ({ exists: true, data: () => ({ userId: 'ZA-12345', name: 'Akhil', setupCompleted: true }) }),
      update: async (data: any) => {},
      set: async (data: any) => {}
    }),
    collection: (path: string) => ({
      get: async () => ({ docs: [{ data: () => ({ username: 'TestUser', xp: 1200, streak: 5, avatar: 'https://ui-avatars.com/api/?name=TU' }) }] })
    }),
    friends: {
      list: async (uid: string) => [],
      findUserByZaId: async (id: string) => null
    },
    groups: {
      list: async (uid: string) => [],
      sendMessage: async (gid: string, msg: any) => {},
      join: async (code: string, uid: string) => ({ id: 'g1', name: 'New Group', inviteCode: code, memberCount: 1, type: 'group' as const }),
      create: async (n: string, d: string, i: string, u: string) => ({ id: 'g2', name: n, inviteCode: 'ABCDEF', type: 'group' as const, memberCount: 1 })
    },
    notes: {
      getAll: async () => DB.get('notes') as Note[],
      save: async (note: Note) => {
        const notes = DB.get('notes');
        const idx = notes.findIndex((n: Note) => n.id === note.id);
        if (idx > -1) notes[idx] = note;
        else notes.push(note);
        DB.set('notes', notes);
      },
      delete: async (id: string) => {
        const notes = DB.get('notes');
        DB.set('notes', notes.filter((n: Note) => n.id !== id));
      }
    },
    feedback: {
      submit: async (data: FeedbackSubmission) => {}
    },
    shortNotes: {
      getAll: async () => [],
      upload: async (note: ShortNote) => {}
    },
    formulas: {
      getChapters: async (sub: string) => [],
      generateShareLink: (id: string) => `https://zuaki.ai/formula/${id}`
    },
    pyq: {
      list: async (): Promise<PYQPaper[]> => {
        const years = [2025, 2024, 2023, 2022, 2021, 2020];
        const sessions = ["January", "April"];
        const shifts = ["Shift 1", "Shift 2"];
        const papers: PYQPaper[] = [];

        years.forEach(y => {
          sessions.forEach(s => {
            shifts.forEach(sh => {
              papers.push({
                id: `pyq-${y}-${s}-${sh}`,
                year: y,
                session: s,
                shift: sh,
                subject: 'Full Mock',
                uploadedAt: Date.now(),
                isGenerated: true
              });
            });
          });
        });
        return papers;
      },
      generatePaper: async (year: number, session: string, shift: string): Promise<TestConfig> => {
        const questions = JEE_PYQ_DATA_2020_2025.getShiftQuestions(year, session, shift);
        return {
          id: `pyq-test-${year}-${session}-${shift}`,
          title: `JEE Main ${year} - ${session} - ${shift}`,
          year,
          session,
          shift: shift.includes('1') ? 1 : 2,
          type: 'PYQ',
          subjects: ['Physics', 'Chemistry', 'Maths'],
          duration: 180,
          questionCount: questions.length,
          questions: questions
        };
      },
      calculateRankAndXP: (result: TestResult, year: number) => {
        const multiplier = year >= 2024 ? 1.25 : 1.0;
        const xp = Math.round(((result.correctCount * 20) + (result.accuracy * 5)) * multiplier);
        
        const score = result.score;
        let percentile = 0;
        let rankRange = "";

        if (score >= 260) { percentile = 99.98; rankRange = "1 - 250"; }
        else if (score >= 240) { percentile = 99.85; rankRange = "250 - 1,500"; }
        else if (score >= 200) { percentile = 99.20; rankRange = "1,500 - 8,000"; }
        else if (score >= 170) { percentile = 98.10; rankRange = "8,000 - 18,000"; }
        else if (score >= 140) { percentile = 96.50; rankRange = "18,000 - 40,000"; }
        else if (score >= 100) { percentile = 91.00; rankRange = "40,000 - 95,000"; }
        else { percentile = 75.00; rankRange = "1,50,000+"; }

        return { xp, percentile, rankRange };
      },
      saveResult: async (result: TestResult) => {
          return DB.add('pyq_history', result);
      },
      getHistory: async () => DB.get('pyq_history')
    },
    tests: {
        generateTest: async (cfg: { type: string, subject?: string, chapter?: string, count: number }): Promise<TestConfig> => {
          const questions = JEE_PYQ_DATA_2020_2025.getShiftQuestions(2025, 'January', 'Shift 1').slice(0, cfg.count);
          return {
            id: `gen-test-${Date.now()}`,
            title: `Custom ${cfg.type} Test`,
            type: cfg.type as any,
            subjects: cfg.subject ? [cfg.subject] : ['Physics', 'Chemistry', 'Maths'],
            duration: Math.ceil(cfg.count * 1.5),
            questionCount: cfg.count,
            questions
          };
        },
        generateJEE2025Test: async (shift: number): Promise<TestConfig> => {
          const shiftData = JEE_DATASET.tests.find(t => t.shift === shift);
          const questions: Question[] = shiftData ? (shiftData.questions as any[]).map(q => ({
            ...q, 
            type: q.type as 'MCQ' | 'NUMERICAL', 
            isPYQ: true,
            subject: q.subject as 'Physics' | 'Chemistry' | 'Maths',
            difficulty: q.difficulty as 'Easy' | 'Medium' | 'Hard'
          })) : [];
          return {
            id: `jee2025-s${shift}`,
            title: `JEE Main 2025 - Shift ${shift}`,
            type: 'PYQ',
            subjects: ['Physics', 'Chemistry', 'Maths'],
            duration: 180,
            questionCount: questions.length,
            questions: questions
          };
        },
        saveResult: async (result: any) => DB.add('test_results', result),
        getHistory: async () => DB.get('test_results').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  })
};
