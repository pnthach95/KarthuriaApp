const assets = 'https://cdn.karth.top/api/assets/';

export const charaBase = (id: number): string =>
  assets + `jp/res/ui/images/archive/archive_chara/select/base_${id}.png`;

export const charaPortrait = (id: number): string =>
  assets +
  `jp/res/ui/images/archive/archive_chara/select/chara_portrait_${id}.png`;

export const iconAct = (id: number): string =>
  assets + `jp/res/ui/images/common/icon_act_${id}.png`;

export const iconChara = (id: number): string =>
  assets + `jp/res/ui/images/filter_sort/icon_filter_character_${id}.png`;

export const iconFieldEffect = (id: number): string =>
  assets + `jp/res/icon/field_effect/${id}.png`;

export const iconSkill = (id: number): string =>
  assets + `jp/res/battle/skill_icon/skill_icon_${id}.png`;

export const iconSchool = (id: number): string =>
  assets + `jp/res/ui/images/chat/icon_school_${id}.png`;

export const imgCharater = (id: number): string =>
  assets + `jp/res/gaf/quest/skip_effect_character/character_${id}.png`;

export const imgDefaultEvent =
  assets + 'ww/res/ui/images/common/base_heading_medium.png';

export const imgEnemy = (id: number): string =>
  assets + `jp/res/icon/enemy/${id > 9999999 ? (id / 100).toFixed(0) : id}.png`;

export const imgEvent = (id: number): string =>
  assets + `ww/res_en/res/event_permanent/banner/event_banner_${id}.png`;

export const imgItem = (id: number): string =>
  assets + `jp/res/item_root/medium/38_${id}.png`;

export const imgMemoir = (id: string): string =>
  assets + `jp/res/item_root/large/2_${id}.png`;

export const imgMemoirBig = (id: string): string =>
  assets + `dlc/res/equip/cg/${id}/image.png`;

export const imgRogue = (id: number): string =>
  assets + `jp/res/item_root/large/1_${id}.png`;

export const imgStageGirl = (id: string | number): string =>
  assets + `jp/res/item_root/large/1_${id}.png`;

export const imgStageGirlBig = (id: string): string =>
  assets + `dlc/res/dress/cg/${id}/image.png`;
