export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation?: string;
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  plays: number;
  featured?: boolean;
  coverImage?: string;
  questions: Question[];
}

export type BlookRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Chroma';

export interface Blook {
  id: string;
  name: string;
  rarity: BlookRarity;
  color: string;
  image?: string;
  emoji: string;
  description: string;
  dropRate: string;
}

export interface PlayerScore {
  id: string;
  name: string;
  blook: Blook;
  score: number;
  gold: number;
  streak: number;
}
