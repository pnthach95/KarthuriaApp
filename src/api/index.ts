import {create} from 'apisauce';

export const website = 'https://karth.top';

const API = create({
  baseURL: website + '/api',
});

export const links = {
  LIST: {
    CHARA: 'chara.json',
    DRESS: 'dress.json',
    DRESS_SKILLS: 'dressSkills.json',
    SKILLS_FILTER: 'skillsFilter.json',
    EQUIP: 'equip.json',
    EQUIP_SKILLS: 'equipSkills.json',
    ACCESSORY: 'accessory.json',
    ENEMY: 'enemy.json',
  },
  CHARA: 'chara/',
  DRESS: 'dress/',
  EQUIP: 'equip/',
  ACCESSORY: 'accessory/',
  ENEMY: 'enemy/',
  EVENT: {
    WW: 'event/ww/current.json',
    JP: 'event/jp/current.json',
  },
  GACHA: {
    WW: 'gacha/ww/current.json',
    JP: 'gacha/jp/current.json',
  },
  LOGINBONUS: {
    WW: 'loginbonus/ww/current.json',
    JP: 'loginbonus/jp/current.json',
  },
  RANKING: {
    WW: 'ranking/ww/current.json',
    JP: 'ranking/jp/current.json',
  },
};

export default API;
