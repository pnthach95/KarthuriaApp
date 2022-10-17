/**
 * whyDidYouRender
 */

/// <reference types="@welldone-software/why-did-you-render" />

import React from 'react';

if (__DEV__) {
  const debugging = false;
  if (debugging) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      onlyLogs: true,
    });
  }
}
