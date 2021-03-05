import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { stageGirlImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import AppStyles from '~/theme/styles';
import { attackType, attribute, position, rarity } from '~/assets';
import frame from '~/assets/common/frame_stage_girl.png';

import type {
  TDressBasicInfo,
  TDressList,
  StageGirlsScreenProps,
} from '~/typings';

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
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    padding: 5,
  },
  rarity: {
    alignSelf: 'center',
    bottom: 0,
    height: 14,
    width: 70,
  },
  role: {
    height: 40 / 3,
    top: 20,
    width: 20,
  },
});

const StageGirls = ({ navigation }: StageGirlsScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [sgList, setSGList] = useState<TDressBasicInfo[]>([]);
  const top = {
    paddingTop: insets.top,
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await API.get<TDressList>(links.LIST.DRESS);
      if (data.data) {
        setSGList(Object.values(data.data));
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = ({ basicInfo }: TDressBasicInfo) =>
    `sg_${basicInfo.cardID}`;

  const renderItem = ({ item }: { item: TDressBasicInfo }) => {
    const { basicInfo, base, stat } = item;
    const onPress = () => {
      navigation.navigate('StageGirlDetail', { id: basicInfo.cardID });
    };

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={[styles.item, { borderColor: colors.border }]}>
          <Text style={AppStyles.centerText}>
            {basicInfo.name.en || basicInfo.name.ja}
          </Text>
          <View style={AppStyles.center}>
            <View style={styles.frame}>
              <FastImage
                source={{
                  uri: stageGirlImg(basicInfo.cardID),
                  cache: 'cacheOnly',
                }}
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
      </TouchableRipple>
    );
  };

  if (loading) {
    return <Kirin />;
  }

  if (sgList.length > 0) {
    return (
      <FlatList
        data={sgList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={top}
        numColumns={2}
        initialNumToRender={12}
      />
    );
  }

  return <ErrorView />;
};

export default StageGirls;
