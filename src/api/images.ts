const assets = 'https://api.karen.makoo.eu/api/assets/jp/res/';

export const charaterImg = (id: number): string =>
  assets + `gaf/quest/skip_effect_character/character_${id}.png`;

export const schoolIcon = (id: number): string =>
  assets + `ui/images/chat/icon_school_${id}.png`;

export const charaPortrait = (id: number): string =>
  assets + `ui/images/archive/archive_chara/select/chara_portrait_${id}.png`;

export const charaBase = (id: number): string =>
  assets + `ui/images/archive/archive_chara/select/base_${id}.png`;
