/**
 * whyDidYouRender
 */

/// <reference types="@welldone-software/why-did-you-render" />

import React from 'react';

if (__DEV__) {
  const debugging = false;
  if (debugging) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      onlyLogs: true,
    });
  }
}
