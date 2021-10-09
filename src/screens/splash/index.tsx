import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useAppContext } from '~/context';
import Kirin from '~/components/kirin';
import { getObject } from '~/mmkv';

import type { AppOptions } from '~/typings';

/** Loading Screen */
const SplashScreen = (): JSX.Element => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const getData = async () => {
      const options = await getObject<AppOptions>('options');
      if (options) {
        dispatch({ type: 'SAVE_OPTIONS', data: options });
      }
      await RNBootSplash.hide({ fade: true });
      dispatch({ type: 'SWITCH_MAIN_ROUTE', route: 'MAIN' });
    };
    void getData();
  }, []);

  return <Kirin />;
};

SplashScreen.whyDidYouRender = true;

export default SplashScreen;
