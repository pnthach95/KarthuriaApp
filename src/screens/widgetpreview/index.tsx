import React from 'react';
import {View} from 'react-native';
import {WidgetPreview} from 'react-native-android-widget';
import EventWidget from 'widgets/event';

const data: TEvent[] = [
  {
    id: 79,
    info: 0,
    beginAt: [1611640800],
    endAt: [3999999999],
  },
  {
    id: 215,
    info: 2023032902,
    beginAt: [1680073200, 1680073201, 1680073202, 1680073203],
    endAt: [1681196399, 1681455599, 1681455599, 1681196399],
  },
  {
    id: 218,
    info: 2023031303,
    beginAt: [1678690800, 1678690800, 1678690800, 1678690800],
    endAt: [1680073199, 1680332399, 1680073199, 1680332399],
  },
];

const WidgetPreviewScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <WidgetPreview
        height={200}
        renderWidget={() => (
          <EventWidget currentEvent={data[0]} events={data} />
        )}
        width={320}
      />
    </View>
  );
};

export default WidgetPreviewScreen;
