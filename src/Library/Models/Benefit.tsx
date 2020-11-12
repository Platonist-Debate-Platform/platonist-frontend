import { Icon } from './Icon';
import { ContentKeys } from './Content';

export interface Benefit {
  created_at: Date;
  icon?: Icon;
  id: number;
  lead?: string;
  title: string;
  updated_at: Date;
}

export interface BenefitListItem {
  benefit?: Benefit | null;
  id: number;
}

export interface BenefitList {
  __component: ContentKeys;
  id: number;
  items?: (BenefitListItem | null)[] | null;
  lead?: string | null;
  title: string;
}