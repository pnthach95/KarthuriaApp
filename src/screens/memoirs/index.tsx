import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { memoirImg, skillIcon } from '~/api/images';
import { rarity } from '~/assets';
import Kirin from '~/components/kirin';
import AppStyles from '~/theme/styles';
import frame from '~/assets/common/frame_equip.png';

import type {
  TEquipBasicInfo,
  TEquipList,
  MemoirsScreenProps,
} from '~/typings';

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    height: 160 * 0.5,
    width: 144 * 0.5,
  },
  item: {
    borderWidth: 1,
    flex: 1,
    padding: 5,
  },
  rarity: {
    alignSelf: 'center',
    height: 14,
    width: 70,
  },
  skillIcon: {
    height: 25,
    width: 25,
  },
});

const Memoirs = ({ navigation }: MemoirsScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mList, setMList] = useState<TEquipBasicInfo[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TEquipList>(links.LIST.EQUIP);
        if (gotData.data) {
          setMList(
            Object.values(gotData.data).sort((a, b) =>
              a.basicInfo.published.ja < b.basicInfo.published.ja ? 1 : -1,
            ),
          );
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
        <View style={[styles.item, { borderColor: colors.border }]}>
          <View style={styles.frame}>
            <FastImage
              source={{ uri: memoirImg(item.basicInfo.cardID) }}
              style={styles.frame}
            />
            <FastImage
              source={frame}
              style={[styles.frame, AppStyles.absolute]}
            />
          </View>
          <View style={[AppStyles.center, AppStyles.row]}>
            <FastImage
              source={rarity(item.basicInfo.rarity)}
              resizeMode='contain'
              style={styles.rarity}
            />
            <FastImage
              source={{ uri: skillIcon(item.skill.iconID) }}
              style={styles.skillIcon}
            />
          </View>
          <Text style={AppStyles.centerText}>
            {item.basicInfo.name.en || item.basicInfo.name.ja}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

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
    />
  );
};

export default Memoirs;
