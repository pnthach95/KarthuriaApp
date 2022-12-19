import API, {links} from 'api';
import {imgItem, imgStageGirl} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableRipple, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from 'typings/navigation';

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
      <TouchableRipple
        className="flex-1 items-center justify-between border p-1 pb-3"
        style={{borderColor: colors.outlineVariant}}
        onPress={onPress}>
        <View className="self-center">
          <FastImage
            className="aspect-square w-[78px]"
            source={{uri: imgItem(item.basicInfo.iconID)}}
          />
          <FastImage
            className="absolute aspect-square w-[78px]"
            source={frame}
          />
          <FastImage
            className="absolute left-[-5px] bottom-[-5px] aspect-stage-girl w-7 rounded"
            source={{uri: imgStageGirl(item.basicInfo.cards[0])}}
          />
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
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return <ErrorView />;
};

AccessoriesScreen.whyDidYouRender = true;

export default AccessoriesScreen;
