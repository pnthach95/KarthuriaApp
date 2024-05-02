import 'intl-pluralrules';
import {AppRegistry, LogBox} from 'react-native';
import {registerWidgetTaskHandler} from 'react-native-android-widget';
import App from 'routes';
import {widgetTaskHandler} from 'widgets/event/task';
import {name as appName} from './app.json';

if (__DEV__) {
  require('./ReactotronConfig');
}

LogBox.ignoreLogs(["Seems like you're using an old API"]);

AppRegistry.registerComponent(appName, () => App);
registerWidgetTaskHandler(widgetTaskHandler);
