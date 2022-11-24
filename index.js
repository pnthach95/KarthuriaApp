import 'utils/wdyr';
import 'intl-pluralrules';
import {AppRegistry, LogBox} from 'react-native';
import App from 'routes';
import {name as appName} from './app.json';

LogBox.ignoreLogs(["Seems like you're using an old API"]);

AppRegistry.registerComponent(appName, () => App);
