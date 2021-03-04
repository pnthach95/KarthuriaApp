import a1 from '~/assets/attributes/1.png';
import a2 from '~/assets/attributes/2.png';
import a3 from '~/assets/attributes/3.png';
import a4 from '~/assets/attributes/4.png';
import a5 from '~/assets/attributes/5.png';
import a6 from '~/assets/attributes/6.png';
import a7 from '~/assets/attributes/7.png';
import pBack from '~/assets/positions/back.png';
import pMid from '~/assets/positions/middle.png';
import pFront from '~/assets/positions/front.png';
import r1 from '~/assets/rarities/1_1.png';
import r2 from '~/assets/rarities/2_2.png';
import r3 from '~/assets/rarities/3_3.png';
import r4 from '~/assets/rarities/4_4.png';
import at1 from '~/assets/attacktype/1.png';
import at2 from '~/assets/attacktype/2.png';
import att1 from '~/assets/attacktype/text_1.png';
import att2 from '~/assets/attacktype/text_2.png';

import type { TRole } from '~/typings';

export const attribute = (id: number): number => {
  switch (id) {
    case 1:
      return a1;
    case 2:
      return a2;
    case 3:
      return a3;
    case 4:
      return a4;
    case 5:
      return a5;
    case 6:
      return a6;
    default:
      return a7;
  }
};

export const position = (key: TRole): number => {
  switch (key) {
    case 'back':
      return pBack;
    case 'middle':
      return pMid;
    case 'front':
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
