import API, {links} from 'api';
import dayjs from 'dayjs';
import React from 'react';
import {Appearance} from 'react-native';
import {MMKV} from 'store';
import EventWidget from './index';
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';

const nameToWidget = {
  Event: EventWidget,
};

const getData = async () => {
  const response = await API.get<TCurrentEvent>(links.EVENT.WW);
  return response.data
    ? Object.values(response.data.event)
        .map(d => ({
          ...d,
          beginAt: d.beginAt.reduce<number[]>(
            (res, current) =>
              res.findIndex(v => v === current) === -1
                ? [...res, current]
                : res,
            [],
          ),
          endAt: d.endAt.reduce<number[]>(
            (res, current) =>
              res.findIndex(v => v === current) === -1
                ? [...res, current]
                : res,
            [],
          ),
        }))
        .filter(item => {
          const e = item.endAt.map(i => dayjs(i * 1000));
          if (
            e.reduce(
              (res, current) => current.diff(dayjs(), 'y') > 1 || res,
              false,
            )
          ) {
            return false;
          }
          return true;
        })
    : undefined;
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const store = (await MMKV.getItem('karthuria')) as string;
  const isDark =
    (JSON.parse(store) as {state: StoreState})?.state?.options.isDark ??
    Appearance.getColorScheme() === 'dark';
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      {
        const events = await getData();
        props.renderWidget(
          <Widget
            currentEvent={events?.[0]}
            events={events}
            idx={0}
            isDark={isDark}
          />,
        );
      }
      break;
    case 'WIDGET_RESIZED':
      // Not needed for now
      break;
    case 'WIDGET_CLICK':
      const events = await getData();
      props.renderWidget(
        <Widget
          currentEvent={events?.[(props.clickActionData?.index as number) || 0]}
          events={events}
          idx={props.clickActionData?.index as number}
          isDark={isDark}
        />,
      );
      break;
    default:
      break;
  }
}
