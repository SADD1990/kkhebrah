
export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface User {
  name: string;
  avatar: string;
  bio: string;
  skills: Skill[];
}

export interface Recommendation {
  id: string;
  name: string;
  skill: string;
  rating: number;
  avatar: string;
  reason: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'expert' | 'bot';
    timestamp: string;
    status?: 'safe' | 'flagged';
}

export enum SearchType {
  SMART = "SMART",
  CHRONOLOGICAL = "CHRONOLOGICAL",
}
