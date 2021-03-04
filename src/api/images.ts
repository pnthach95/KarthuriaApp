const assets = 'https://api.karen.makoo.eu/api/assets/jp/res/';

const assetsEN = 'https://api.karen.makoo.eu/api/assets/ww/';

export const charaterImg = (id: number): string =>
  assets + `gaf/quest/skip_effect_character/character_${id}.png`;

export const schoolIcon = (id: number): string =>
  assets + `ui/images/chat/icon_school_${id}.png`;

export const charaPortrait = (id: number): string =>
  assets + `ui/images/archive/archive_chara/select/chara_portrait_${id}.png`;

export const charaBase = (id: number): string =>
  assets + `ui/images/archive/archive_chara/select/base_${id}.png`;

export const stageGirlImg = (id: string): string =>
  assets + `item_root/large/1_${id}.png`;

export const eventImg = (id: number): string =>
  assetsEN + `res_en/res/event_permanent/banner/event_banner_${id}.png`;

export const defaultEventImg =
  assetsEN + 'res/ui/images/common/base_heading_medium.png';

export const enemyImg = (id: number): string =>
  assets + `icon/enemy/${(id / 100).toFixed(0)}.png`;

export const itemImg = (id: number): string =>
  assets + `item_root/medium/38_${id}.png`;

export const rogueImg = (id: number): string =>
  assets + `item_root/large/1_${id}.png`;
