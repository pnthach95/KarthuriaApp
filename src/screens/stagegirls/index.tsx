import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { stageGirlImg } from '~/api/images';
import Kirin from '~/components/kirin';
import AppStyles from '~/theme/styles';
import { attackType, attribute, position, rarity } from '~/assets';
import frame from '~/assets/common/frame.png';

import type { TDressBasicInfo, TDressList } from '~/typings';

const styles = StyleSheet.create({
  attackType: {
    height: 17,
    right: 0,
    width: 20,
  },
  attribute: {
    height: 20,
    width: 20,
  },
  frame: {
    height: 160 * 0.5,
    width: 144 * 0.5,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  rarity: {
    alignSelf: 'center',
    bottom: 0,
    height: 14,
    width: 70,
  },
  role: {
    height: (30 * 20) / 45,
    top: 20,
    width: 20,
  },
  separator: {
    height: 10,
  },
});

const StageGirls = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [sgList, setSGList] = useState<TDressBasicInfo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await API.get<TDressList>(links.LIST.DRESS);
      if (data.data) {
        const tmp: TDressBasicInfo[] = [];
        Object.keys(data.data).forEach((key) => {
          if (data.data) {
            tmp.push(data.data[key]);
          }
        });
        setSGList(tmp);
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = ({ basicInfo }: TDressBasicInfo) =>
    `sg_${basicInfo.cardID}`;

  const renderItem = ({ item }: { item: TDressBasicInfo }) => {
    const { basicInfo, base, stat } = item;

    return (
      <View style={styles.item}>
        <Text style={AppStyles.centerText}>
          {basicInfo.name.en || basicInfo.name.ja}
        </Text>
        <View style={AppStyles.center}>
          <View style={styles.frame}>
            <FastImage
              source={{ uri: stageGirlImg(basicInfo.cardID) }}
              style={styles.frame}
            />
            <FastImage
              source={frame}
              style={[styles.frame, AppStyles.absolute]}
            />
            <FastImage
              source={attribute(base.attribute)}
              style={[styles.attribute, AppStyles.absolute]}
            />
            <FastImage
              source={position(base.roleIndex.role)}
              style={[styles.role, AppStyles.absolute]}
            />
            <FastImage
              source={rarity(basicInfo.rarity)}
              resizeMode='contain'
              style={[styles.rarity, AppStyles.absolute]}
            />
            <FastImage
              source={attackType(base.attackType)}
              style={[styles.attackType, AppStyles.absolute]}
            />
          </View>
          <Text style={AppStyles.centerText}>Total: {stat.total}</Text>
        </View>
      </View>
    );
  };

  const itemSeparator = () => <View style={styles.separator} />;

  if (loading) {
    return <Kirin />;
  }

  return (
    <FlatList
      data={sgList}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={2}
      initialNumToRender={12}
      columnWrapperStyle={AppStyles.columnWrapper}
      ItemSeparatorComponent={itemSeparator}
    />
  );
};

export default StageGirls;
