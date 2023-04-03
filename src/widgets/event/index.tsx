/* eslint-disable react-native/no-inline-styles */
import {imgEvent} from 'api/images';
import dayjs from 'dayjs';
import React from 'react';
import {FlexWidget, ImageWidget, TextWidget} from 'react-native-android-widget';
import type {ImageWidgetSource} from 'react-native-android-widget';

type Props = {
  idx: number;
  events?: TEvent[];
  currentEvent?: TEvent;
};

const RATIO = 3136 / 798;
const borderRadius = 16;

const EventWidget = ({events, idx, currentEvent}: Props) => {
  if (events && currentEvent) {
    const end = currentEvent.endAt.map(i => dayjs(i * 1000));

    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: '#fff3',
          borderRadius,
          flexDirection: 'row',
        }}>
        <FlexWidget>
          {events.map((item, index) => {
            return (
              <FlexWidget
                key={item.id.toString()}
                clickAction={`event-${index}`}
                clickActionData={{index}}
                style={{
                  borderRadius,
                  backgroundColor: idx === index ? '#fff8' : undefined,
                }}>
                <TextWidget
                  style={{padding: 8, fontSize: 16}}
                  text={`${index + 1}`}
                />
              </FlexWidget>
            );
          })}
        </FlexWidget>
        <FlexWidget clickAction="OPEN_APP" style={{flex: 1, padding: 8}}>
          <ImageWidget
            image={imgEvent(currentEvent.id) as ImageWidgetSource}
            imageHeight={200 / RATIO}
            imageWidth={200}
          />
          <FlexWidget
            style={{
              width: 'match_parent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextWidget text="Begin" />
            <FlexWidget style={{flex: 1, alignItems: 'flex-end'}}>
              {[
                ...new Set(
                  currentEvent.beginAt.map(i => dayjs(i * 1000).format('llll')),
                ),
              ].map((s, i) => (
                <TextWidget
                  key={`${i}-${s}`}
                  style={{textAlign: 'right'}}
                  text={s}
                />
              ))}
            </FlexWidget>
          </FlexWidget>
          <FlexWidget
            style={{
              width: 'match_parent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextWidget text="End" />
            <FlexWidget style={{flex: 1, alignItems: 'flex-end'}}>
              {end.map((e, i) => (
                <TextWidget
                  key={`${i}-${e.toISOString()}`}
                  style={{textAlign: 'right'}}
                  text={e.format('llll')}
                />
              ))}
            </FlexWidget>
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    );
  }

  return (
    <TextWidget
      style={{
        fontSize: 32,
        fontFamily: 'Inter',
        color: '#000000',
      }}
      text="No event"
    />
  );
};

export default EventWidget;
