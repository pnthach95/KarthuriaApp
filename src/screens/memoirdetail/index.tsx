import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { memoirBigImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import AppStyles from '~/theme/styles';
import frame from '~/assets/common/frame_thumbnail_equip.png';

import type { OnLoadEvent } from 'react-native-fast-image';
import type { MemoirDetailProps, TEquip } from '~/typings';
import { rarity } from '~/assets';

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    height: 360 * 0.6,
    width: 480 * 0.6,
  },
  frameBorderRadius: {
    borderRadius: 10,
  },
  rarity: {
    bottom: 5,
    left: 5,
  },
});

const MemoirDetail = ({ route }: MemoirDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [memoir, setMemoir] = useState<TEquip | null>(null);
  const [raritySize, setRaritySize] = useState({ height: 28, width: 140 });

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

  const onLoad = (e: OnLoadEvent) =>
    setRaritySize({
      height: e.nativeEvent.height * 0.2,
      width: e.nativeEvent.width * 0.2,
    });

  return (
    <BaseScreen loading={loading} hasData={!!memoir}>
      {memoir && (
        <>
          <Headline style={AppStyles.centerText}>
            {memoir.basicInfo.name.en || memoir.basicInfo.name.ja}
          </Headline>
          <View style={styles.frame}>
            <FastImage
              source={{ uri: memoirBigImg(memoir.basicInfo.cardID) }}
              style={[styles.frame, styles.frameBorderRadius]}
            />
            <FastImage
              source={frame}
              style={[styles.frame, AppStyles.absolute]}
            />
            <FastImage
              source={rarity(memoir.basicInfo.rarity)}
              resizeMode='contain'
              onLoad={onLoad}
              style={[styles.rarity, AppStyles.absolute, raritySize]}
            />
          </View>
          <Text>{JSON.stringify(memoir)}</Text>
        </>
      )}
    </BaseScreen>
  );
};

export default MemoirDetail;
