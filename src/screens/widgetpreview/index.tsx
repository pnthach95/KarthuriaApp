import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {WidgetPreview} from 'react-native-android-widget';
import {Text} from 'react-native-paper';
import EventWidget from 'widgets/event';
import {getEventData} from 'widgets/event/task';

const WidgetPreviewScreen = () => {
  const {t} = useTranslation();
  const [eventData, setEventData] = useState<TEvent[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await getEventData();
    if (response) {
      setEventData(response);
    }
  };

  return (
    <View className="flex-1 p-3">
      <Text>{t('widget.note')}</Text>
      <View className="flex-1 items-center justify-center">
        <WidgetPreview
          height={115}
          renderWidget={() => (
            <EventWidget
              isDark
              currentEvent={eventData[0]}
              events={eventData}
              idx={0}
            />
          )}
          width={240}
        />
      </View>
    </View>
  );
};

export default WidgetPreviewScreen;
