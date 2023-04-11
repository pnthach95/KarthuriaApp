/**
 * whyDidYouRender
 */

import React from 'react';
import type {WhyDidYouRenderOptions} from '@welldone-software/why-did-you-render';

if (__DEV__) {
  const debugging = false;
  if (debugging) {
    const whyDidYouRender =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@welldone-software/why-did-you-render') as (
        react: typeof React,
        options?: WhyDidYouRenderOptions,
      ) => typeof React;
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      onlyLogs: true,
    });
  }
}
