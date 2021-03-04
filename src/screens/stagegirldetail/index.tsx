import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption, Headline, Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import API, { links } from '~/api';
import BaseScreen from '~/components/basescreen';
import Separator from '~/components/separator';
import AppStyles from '~/theme/styles';

import type { TDress, StageGirlDetailProps } from '~/typings';

const styles = StyleSheet.create({
  padding: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

const StageGirlDetail = ({ route }: StageGirlDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<TDress | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { id } = route.params;
      const data = await API.get<TDress>(links.DRESS + `${id}.json`);
      if (data.data) {
        setDress(data.data);
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <BaseScreen loading={loading} hasData={!!dress}>
      <View style={styles.padding}>
        <Headline style={AppStyles.centerText}>
          {dress?.basicInfo.name.en || dress?.basicInfo.name.ja}
        </Headline>
        <Caption>Release date</Caption>
        {dress?.basicInfo.released.ja && (
          <Text>
            Japanese:{' '}
            {dayjs(dress?.basicInfo.released.ja * 1000).format('LLLL')}
          </Text>
        )}
        {dress?.basicInfo.released.ww && (
          <Text>
            Worldwide:{' '}
            {dayjs(dress?.basicInfo.released.ww * 1000).format('LLLL')}
          </Text>
        )}
        <Separator />
        <Caption>Profile</Caption>
        <Text>
          {dress?.basicInfo.profile.en || dress?.basicInfo.profile.ja}
        </Text>
        <Separator />
        <Caption>Message</Caption>
        <Text>
          {dress?.basicInfo.message.en || dress?.basicInfo.message.ja}
        </Text>
        <Separator />
        <Caption>Description</Caption>
        <Text>
          {dress?.basicInfo.description.en || dress?.basicInfo.description.ja}
        </Text>
        <Separator />
        <View>
          <Text>{JSON.stringify(dress, null, 2)}</Text>
        </View>
      </View>
    </BaseScreen>
  );
};

export default StageGirlDetail;
