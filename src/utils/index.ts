import {alert} from '@baronha/ting';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import i18n from 'locales';
import {Alert, Linking, Platform} from 'react-native';
import BlobUtil from 'react-native-blob-util';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import type {PermissionStatus} from 'react-native-permissions';

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
    case 406:
      return 24;
    case 407:
      return 25;
    case 408:
      return 26;
    case 409:
      return 27;
    case 410:
      return 28;
    case 501:
      return 29;
    case 502:
      return 30;
    case 503:
      return 31;
    default:
      return -1;
  }
};

const session = 'downloadImage';

const askOpenSettings = () => {
  Alert.alert(i18n.t('save-image.error'), i18n.t('save-image.error-detail'), [
    {
      onPress: () => {
        Linking.openSettings();
      },
      isPreferred: true,
      style: 'default',
      text: i18n.t('save-image.open-settings'),
    },
    {
      style: 'cancel',
      text: i18n.t('cancel'),
    },
  ]);
};

export const onDownloadImage = async (url: string, filename: string) => {
  let status: PermissionStatus =
    Platform.OS === 'ios' ? RESULTS.UNAVAILABLE : RESULTS.GRANTED;
  try {
    if (Platform.OS === 'ios') {
      // On iOS, full permission is needed to save pictures into specific album
      status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (status !== RESULTS.GRANTED) {
        status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (status !== RESULTS.GRANTED) {
          askOpenSettings();
        }
      }
    }
    if (status === RESULTS.GRANTED) {
      const response = await BlobUtil.config({
        fileCache: true,
        path: BlobUtil.fs.dirs.CacheDir + '/' + filename,
        appendExt: 'png',
        session,
      }).fetch('get', url);
      await CameraRoll.saveAsset(
        (Platform.OS === 'android' ? 'file://' : '') + response.path(),
        {album: 'Karth', type: 'photo'},
      );
      alert({
        title: i18n.t('save-image.title'),
        message: i18n.t('save-image.success'),
        preset: 'done',
        haptic: 'success',
      });
      BlobUtil.session(session).dispose();
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('PHPhotosErrorDomain')) {
        askOpenSettings();
      } else {
        alert({
          title: i18n.t('save-image.title'),
          message: i18n.t('save-image.failed'),
          preset: 'error',
          haptic: 'error',
        });
      }
    }
  }
};
