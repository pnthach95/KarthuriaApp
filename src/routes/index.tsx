import 'locales';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {setRootViewBackgroundColor} from '@pnthach95/react-native-root-view-background';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NetworkProvider} from 'react-native-offline';
import {Provider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {onSwitchMainRoute, useHydration, useLanguage, useOptions} from 'store';
import {useAppTheme} from 'theme';
import Navigation from './navigation';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

const Routes = () => {
  const hydrated = useHydration(),
    {i18n} = useTranslation(),
    options = useOptions(),
    language = useLanguage(),
    {appMaterialLight, appMaterialDark} = useAppTheme();
  const theme = options.isDark ? appMaterialDark : appMaterialLight;

  useEffect(() => {
    const getData = async () => {
      await RNBootSplash.hide({fade: true});
      onSwitchMainRoute('MAIN');
    };
    if (hydrated) {
      getData();
    }
  }, [hydrated]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    setRootViewBackgroundColor(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <GestureHandlerRootView className="flex-1">
      <NetworkProvider>
        <SafeAreaProvider>
          <Provider theme={theme}>
            <BottomSheetModalProvider>
              <Navigation />
            </BottomSheetModalProvider>
          </Provider>
        </SafeAreaProvider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
};

export default Routes;
