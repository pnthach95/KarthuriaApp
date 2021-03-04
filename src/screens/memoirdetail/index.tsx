import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import BaseScreen from '~/components/basescreen';
import AppStyle from '~/theme/styles';
import frame from '~/assets/common/frame_thumbnail_equip.png';

import type { MemoirDetailProps, TEquip } from '~/typings';

const styles = StyleSheet.create({
  frame: {
    height: 360 * 0.6,
    width: 480 * 0.6,
  },
});

const MemoirDetail = ({ route }: MemoirDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [memoir, setMemoir] = useState<TEquip | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TEquip>(
          links.EQUIP + route.params.id + '.json',
        );
        if (gotData.data) {
          setMemoir(gotData.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <BaseScreen loading={loading} hasData={!!memoir}>
      {memoir && (
        <>
          <Headline style={AppStyle.centerText}>
            {memoir.basicInfo.name.en || memoir.basicInfo.name.ja}
          </Headline>
          <View style={AppStyle.center}>
            <FastImage source={frame} style={styles.frame} />
          </View>
          <Text>{JSON.stringify(memoir)}</Text>
        </>
      )}
    </BaseScreen>
  );
};

export default MemoirDetail;
