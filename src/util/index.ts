export const sentry =
  'https://fa9c36cacead456f8e084339435c9b62@o208652.ingest.sentry.io/5705927';

export const characterToIndex = (character: number): number => {
  switch (character) {
    case 101:
      return 0;
    case 102:
      return 1;
    case 103:
      return 2;
    case 104:
      return 3;
    case 105:
      return 4;
    case 106:
      return 5;
    case 107:
      return 6;
    case 108:
      return 7;
    case 109:
      return 8;
    case 201:
      return 9;
    case 202:
      return 10;
    case 203:
      return 11;
    case 204:
      return 12;
    case 205:
      return 13;
    case 301:
      return 14;
    case 302:
      return 15;
    case 303:
      return 16;
    case 304:
      return 17;
    case 305:
      return 18;
    case 401:
      return 19;
    case 402:
      return 20;
    case 403:
      return 21;
    case 404:
      return 22;
    case 405:
      return 23;
    case 501:
      return 24;
    case 502:
      return 25;
    case 503:
      return 26;
    default:
      return -1;
  }
};
