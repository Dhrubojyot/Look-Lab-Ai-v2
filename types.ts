
export enum ClothingType {
  TOP = 'top',
  BOTTOM = 'bottom',
  ACCESSORY = 'accessory',
}

export interface OutfitItem {
  type: ClothingType;
  data: string; // base64 encoded image
}
