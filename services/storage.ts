// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROGRESS: 'user_progress',
  MOOD_HISTORY: 'mood_history',
  DAILY_ENTRIES: 'daily_entries',
  FIRST_LAUNCH: 'first_launch'
};

export interface UserProgress {
  userName: string;
  petName: string;
  totalXP: number;
  currentStreak: number;
  lastCheckIn: string;
  petBond: number;
  level: number;
}

export interface DailyEntry {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tasksCompleted: string[];
  xpEarned: number;
}

class StorageService {
  // Get user progress
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return null;
    }
  }

  // Save user progress
  async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        KEYS.USER_PROGRESS, 
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  // Check if first launch
  async isFirstLaunch(): Promise<boolean> {
    try {
      const hasLaunched = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH);
      if (!hasLaunched) {
        await AsyncStorage.setItem(KEYS.FIRST_LAUNCH, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking if first launch:', error);
      return false;
    }
  }

  // Get today's entry
  async getTodayEntry(): Promise<DailyEntry | null> {
    const today = new Date().toISOString().split('T')[0];
    try {
      const entries = await this.getAllEntries();
      return entries.find(entry => entry.date === today) || null;
    } catch (error) {
      console.error('Error getting today\'s entry:', error);
      return null;
    }
  }

  // Save today's entry
  async saveTodayEntry(entry: DailyEntry): Promise<void> {
    try {
      const entries = await this.getAllEntries();
      const index = entries.findIndex(e => e.date === entry.date);
      
      if (index >= 0) {
        entries[index] = entry;
      } else {
        entries.push(entry);
      }
      
      // Keep only last 30 days
      const sorted = entries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const recent = sorted.slice(0, 30);
      
      await AsyncStorage.setItem(
        KEYS.DAILY_ENTRIES, 
        JSON.stringify(recent)
      );
    } catch (error) {
      console.error('Error saving daily entry:', error);
    }
  }

  // Get all entries
  async getAllEntries(): Promise<DailyEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all entries:', error);
      return [];
    }
  }

  // Calculate streak
  async calculateStreak(): Promise<number> {
    const entries = await this.getAllEntries();
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      const daysDiff = Math.floor(
        (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export default new StorageService();