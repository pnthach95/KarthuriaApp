import at1 from 'assets/attacktype/1.png';
import at2 from 'assets/attacktype/2.png';
import att1 from 'assets/attacktype/text_1.png';
import att2 from 'assets/attacktype/text_2.png';
import char101 from 'assets/characters/101.png';
import char102 from 'assets/characters/102.png';
import char103 from 'assets/characters/103.png';
import char104 from 'assets/characters/104.png';
import char105 from 'assets/characters/105.png';
import char106 from 'assets/characters/106.png';
import char107 from 'assets/characters/107.png';
import char108 from 'assets/characters/108.png';
import char109 from 'assets/characters/109.png';
import char201 from 'assets/characters/201.png';
import char202 from 'assets/characters/202.png';
import char203 from 'assets/characters/203.png';
import char204 from 'assets/characters/204.png';
import char205 from 'assets/characters/205.png';
import char301 from 'assets/characters/301.png';
import char302 from 'assets/characters/302.png';
import char303 from 'assets/characters/303.png';
import char304 from 'assets/characters/304.png';
import char305 from 'assets/characters/305.png';
import char401 from 'assets/characters/401.png';
import char402 from 'assets/characters/402.png';
import char403 from 'assets/characters/403.png';
import char404 from 'assets/characters/404.png';
import char405 from 'assets/characters/405.png';
import char501 from 'assets/characters/501.png';
import char502 from 'assets/characters/502.png';
import char503 from 'assets/characters/503.png';
import pBack from 'assets/positions/back.png';
import pFront from 'assets/positions/front.png';
import pMid from 'assets/positions/middle.png';
import r1 from 'assets/rarities/1_1.png';
import r2 from 'assets/rarities/2_2.png';
import r3 from 'assets/rarities/3_3.png';
import r4 from 'assets/rarities/4_4.png';

export const positionImgs = [pFront, pMid, pBack];

export const position = (key: TRole): number => {
  switch (key) {
    case 'back':
    case 2:
      return pBack;
    case 'middle':
    case 1:
      return pMid;
    case 'front':
    case 0:
      return pFront;
  }
};

export const rarity = (id: number): number => {
  switch (id) {
    case 1:
      return r1;
    case 2:
      return r2;
    case 3:
      return r3;
    default:
      return r4;
  }
};

export const attackType = (id: number): number => {
  return id === 1 ? at1 : at2;
};

export const attackTypeText = (id: number): number => {
  return id === 1 ? att1 : att2;
};

export const charaImgs = [
  char101,
  char102,
  char103,
  char104,
  char105,
  char106,
  char107,
  char108,
  char109,
  char201,
  char202,
  char203,
  char204,
  char205,
  char301,
  char302,
  char303,
  char304,
  char305,
  char401,
  char402,
  char403,
  char404,
  char405,
  char501,
  char502,
  char503,
];
