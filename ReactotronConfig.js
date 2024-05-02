import apisaucePlugin from 'reactotron-apisauce';
import Reactotron from 'reactotron-react-native';

Reactotron.configure()
  .useReactNative({asyncStorage: false})
  .use(apisaucePlugin())
  .connect();
