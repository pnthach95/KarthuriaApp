import '~/util/wdyr';
import { AppRegistry, LogBox } from 'react-native';
import { CacheManager } from '@georstat/react-native-image-cache';
import { Dirs } from 'react-native-file-access';
import App from '~/routes';
import { name as appName } from './app.json';

LogBox.ignoreLogs(["Seems like you're using an old API"]);

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 0,
  sourceAnimationDuration: 1000,
  thumbnailAnimationDuration: 1000,
};

AppRegistry.registerComponent(appName, () => App);
