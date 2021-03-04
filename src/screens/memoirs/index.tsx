import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { memoirImg, skillIcon } from '~/api/images';
import { rarity } from '~/assets';
import Kirin from '~/components/kirin';
import Separator from '~/components/separator';
import AppStyles from '~/theme/styles';
import frame from '~/assets/common/frame_equip.png';

import type {
  TEquipBasicInfo,
  TEquipList,
  MemoirsScreenProps,
} from '~/typings';

const styles = StyleSheet.create({
  frame: {
    height: 160 * 0.5,
    width: 144 * 0.5,
  },
  rarity: {
    alignSelf: 'center',
    bottom: 0,
    height: 14,
    width: 70,
  },
  skillIcon: {
    height: 25,
    width: 25,
  },
});

const Memoirs = ({ navigation }: MemoirsScreenProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [mList, setMList] = useState<TEquipBasicInfo[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TEquipList>(links.LIST.EQUIP);
        if (gotData.data) {
          setMList(Object.values(gotData.data));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = (item: TEquipBasicInfo) =>
    'memoir_' + item.basicInfo.cardID;

  const renderItem = ({ item }: { item: TEquipBasicInfo }) => {
    const onPress = () =>
      navigation.navigate('MemoirDetail', { id: item.basicInfo.cardID });

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={AppStyles.center}>
          <View>
            <FastImage
              source={{ uri: memoirImg(item.basicInfo.cardID) }}
              style={styles.frame}
            />
            <FastImage
              source={frame}
              style={[styles.frame, AppStyles.absolute]}
            />
            <FastImage
              source={rarity(item.basicInfo.rarity)}
              resizeMode='contain'
              style={[styles.rarity, AppStyles.absolute]}
            />
            <FastImage
              source={{ uri: skillIcon(item.skill.iconID) }}
              style={[styles.skillIcon, AppStyles.absolute]}
            />
          </View>
          <Text style={AppStyles.centerText}>
            {item.basicInfo.name.en || item.basicInfo.name.ja}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

  const itemSeparator = () => <Separator />;

  if (loading) {
    return <Kirin />;
  }

  return (
    <FlatList
      data={mList}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={12}
      ItemSeparatorComponent={itemSeparator}
    />
  );
};

export default Memoirs;
