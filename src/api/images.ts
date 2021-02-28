const assets = 'https://api.karen.makoo.eu/api/assets/jp/';

export const charaterImg = (id: number): string =>
  assets + `res/gaf/quest/skip_effect_character/character_${id}.png`;

export const schoolIcon = (id: number): string =>
  assets + `res/ui/images/chat/icon_school_${id}.png`;
