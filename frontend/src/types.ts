export interface ColorVariant {
  name: string;
  color: string;
}

export interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  cost: number;
  collection: string;
  thumbnailUrl: string;
  imageUrl: string;
  hasColorVariants: boolean;
  hasAnimations: boolean;
  colorVariants: ColorVariant[];
  description: string;
}

export interface WeaponType {
  name: string;
  count: number;
}

export type RarityLevel = 'Select' | 'Deluxe' | 'Premium' | 'Ultra';