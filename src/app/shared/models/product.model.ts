export interface CharacterStats {
  strength: number;
  heroism: number;
  wisdom: number;
}

export interface Product {
  id: string;
  title: string;
  type: string;
  category: string;
  domain: string;
  image: string;
  description: string;
  stats: CharacterStats;
  powers: string[];
}