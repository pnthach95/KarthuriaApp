import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useTheme, TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CachedImage } from '@georstat/react-native-image-cache';
import API, { links } from '~/api';
import { itemImg, stageGirlImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import AppStyles, { padding } from '~/theme/styles';
import frame from '~/assets/common/frame_accessory.png';

import type {
  RootStackScreenProps,
  TAccessoryBasicInfo,
  TAccessoryList,
} from '~/typings';

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: padding,
  },
});

const Accessories = ({ navigation }: RootStackScreenProps<'Accessories'>) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [aList, setAList] = useState<TAccessoryBasicInfo[] | null>(null);
  const bottom = {
    paddingBottom: insets.bottom,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TAccessoryList>(links.LIST.ACCESSORY);
        if (gotData.ok && gotData.data) {
          setAList(Object.values(gotData.data));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = (item: TAccessoryBasicInfo) =>
    `acc_${item.basicInfo.accID}`;

  const renderItem = ({ item }: { item: TAccessoryBasicInfo }) => {
    const onPress = () => {
      navigation.navigate('AccessoryDetail', { id: item.basicInfo.accID });
    };

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View
          style={[
            AppStyles.listItem,
            styles.item,
            { borderColor: colors.border },
          ]}>
          <View style={[AppStyles.flex1, AppStyles.center]}>
            <CachedImage
              source={itemImg(item.basicInfo.iconID)}
              style={AppStyles.square78}
            />
            <Image
              source={frame}
              style={[AppStyles.square78, AppStyles.absolute]}
            />
            <CachedImage
              source={stageGirlImg(item.basicInfo.cards[0])}
              style={[AppStyles.stageGirlBottomLeft, AppStyles.absolute]}
            />
          </View>
        </View>
      </TouchableRipple>
    );
  };

  if (loading) {
    return <Kirin />;
  }

  if (aList) {
    return (
      <FlatList
        data={aList}
        numColumns={2}
        keyExtractor={keyExtractor}
        contentContainerStyle={bottom}
        initialNumToRender={12}
        renderItem={renderItem}
      />
    );
  }

  return <ErrorView />;
};

Accessories.whyDidYouRender = true;

export default Accessories;
