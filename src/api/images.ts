const assets = 'https://api.karen.makoo.eu/api/assets/';

export const charaterImg = (id: number): string =>
  assets + `jp/res/gaf/quest/skip_effect_character/character_${id}.png`;

export const schoolIcon = (id: number): string =>
  assets + `jp/res/ui/images/chat/icon_school_${id}.png`;

export const charaPortrait = (id: number): string =>
  assets +
  `jp/res/ui/images/archive/archive_chara/select/chara_portrait_${id}.png`;

export const charaBase = (id: number): string =>
  assets + `jp/res/ui/images/archive/archive_chara/select/base_${id}.png`;

export const stageGirlImg = (id: string | number): string =>
  assets + `jp/res/item_root/large/1_${id}.png`;

export const stageGirlBigImg = (id: string): string =>
  assets + `dlc/res/dress/cg/${id}/image.png`;

export const eventImg = (id: number): string =>
  assets + `ww/res_en/res/event_permanent/banner/event_banner_${id}.png`;

export const defaultEventImg =
  assets + 'ww/res/ui/images/common/base_heading_medium.png';

export const enemyImg = (id: number): string =>
  assets + `jp/res/icon/enemy/${id > 9999999 ? (id / 100).toFixed(0) : id}.png`;

export const itemImg = (id: number): string =>
  assets + `jp/res/item_root/medium/38_${id}.png`;

export const rogueImg = (id: number): string =>
  assets + `jp/res/item_root/large/1_${id}.png`;

export const skillIcon = (id: number): string =>
  assets + `jp/res/battle/skill_icon/skill_icon_${id}.png`;

export const memoirImg = (id: string): string =>
  assets + `jp/res/item_root/large/2_${id}.png`;

export const memoirBigImg = (id: string): string =>
  assets + `dlc/res/equip/cg/${id}/image.png`;

export const charaIcon = (id: number): string =>
  assets + `jp/res/ui/images/filter_sort/icon_filter_character_${id}.png`;

export const actIcon = (id: number): string =>
  assets + `jp/res/ui/images/common/icon_act_${id}.png`;
