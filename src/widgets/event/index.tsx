/* eslint-disable react-native/no-inline-styles */
import {imgEvent} from 'api/images';
import dayjs from 'dayjs';
import React from 'react';
import {FlexWidget, ImageWidget, TextWidget} from 'react-native-android-widget';
import type {ImageWidgetSource} from 'react-native-android-widget';

type Props = {
  idx: number;
  isDark: boolean;
  events?: TEvent[];
  currentEvent?: TEvent;
};

const RATIO = 3136 / 798;
const borderRadius = 16;

const EventWidget = ({events, isDark, idx, currentEvent}: Props) => {
  const backgroundColor = isDark ? '#0006' : '#fff6';
  const buttonColor = isDark ? '#999' : '#ddd';
  const color = isDark ? '#fff' : '#000';

  if (events && currentEvent) {
    const end = currentEvent.endAt.map(i => dayjs(i * 1000));

    return (
      <FlexWidget
        // openApp
        clickAction="OPEN_APP"
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor,
          borderRadius,
          flexDirection: 'row',
          alignItems: 'center',
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
                  backgroundColor: idx === index ? buttonColor : undefined,
                }}>
                <TextWidget
                  style={{padding: 12, fontSize: 16, color}}
                  text={`${index + 1}`}
                />
              </FlexWidget>
            );
          })}
        </FlexWidget>
        <FlexWidget style={{flex: 1, padding: 8}}>
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
            <TextWidget style={{color}} text="Begin" />
            <FlexWidget style={{flex: 1, alignItems: 'flex-end'}}>
              {[
                ...new Set(
                  currentEvent.beginAt.map(i => dayjs(i * 1000).format('llll')),
                ),
              ].map((s, i) => (
                <TextWidget
                  key={`${i}-${s}`}
                  style={{textAlign: 'right', color}}
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
            <TextWidget style={{color}} text="End" />
            <FlexWidget style={{flex: 1, alignItems: 'flex-end'}}>
              {end.map((e, i) => (
                <TextWidget
                  key={`${i}-${e.toISOString()}`}
                  style={{textAlign: 'right', color}}
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
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor,
        borderRadius,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextWidget style={{fontSize: 32, color}} text="No event" />
    </FlexWidget>
  );
};

export default EventWidget;
