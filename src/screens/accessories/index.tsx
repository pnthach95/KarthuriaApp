import {CachedImage} from '@georstat/react-native-image-cache';
import API, {links} from 'api';
import {itemImg, stageGirlImg} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {TouchableRipple, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles, {padding} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: padding,
  },
});

const keyExtractor = (item: TAccessoryBasicInfo) =>
  `acc_${item.basicInfo.accID}`;

const AccessoriesScreen = ({
  navigation,
}: RootStackScreenProps<'Accessories'>) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
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
    loadData();
  }, []);

  const renderItem = ({item}: {item: TAccessoryBasicInfo}) => {
    const onPress = () => {
      navigation.navigate('AccessoryDetail', {id: item.basicInfo.accID});
    };

    return (
      <TouchableRipple style={AppStyles.flex1} onPress={onPress}>
        <View
          style={[
            AppStyles.listItem,
            styles.item,
            {borderColor: colors.border},
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
        contentContainerStyle={bottom}
        data={aList}
        initialNumToRender={12}
        keyExtractor={keyExtractor}
        numColumns={2}
        renderItem={renderItem}
      />
    );
  }

  return <ErrorView />;
};

AccessoriesScreen.whyDidYouRender = true;

export default AccessoriesScreen;
