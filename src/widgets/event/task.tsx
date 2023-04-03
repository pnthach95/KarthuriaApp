import API, {links} from 'api';
import dayjs from 'dayjs';
import React from 'react';
import {openApp} from 'rn-openapp';
import EventWidget from './index';
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
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
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      {
        const events = await getData();
        props.renderWidget(
          <Widget currentEvent={events?.[0]} events={events} idx={0} />,
        );
      }
      break;

    case 'WIDGET_RESIZED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      if (props.clickAction === 'OPEN_APP') {
        try {
          openApp('vn.pnthach.karthuria');
        } catch (error) {
          // console.log(error);
        }
      } else {
        const events = await getData();
        props.renderWidget(
          <Widget
            currentEvent={
              events?.[(props.clickActionData?.index as number) || 0]
            }
            events={events}
            idx={props.clickActionData?.index as number}
          />,
        );
      }
      break;

    default:
      break;
  }
}
