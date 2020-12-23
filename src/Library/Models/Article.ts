import { Ratings } from "./Ratings";

export interface Article {
  id: number;
  isOffline: boolean;
  description: string;
  icon: string | null;
  image: string | null;
  keywords: string | null;
  title: string;
  language: string;
  type: string;
  url: string;
  provider: string;
  published_at: string;
  ratings: (Ratings | null)[] | null;
  created_at: Date | string;
  updated_at: Date | string;
}