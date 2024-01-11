import API, {links} from 'api';
import {imgItem, imgStageGirl} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableRipple} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const keyExtractor = (item: TAccessoryBasicInfo) =>
  `acc_${item.basicInfo.accID}`;

const AccessoriesScreen = ({
  navigation,
}: RootStackScreenProps<'Accessories'>) => {
  const [loading, setLoading] = useState(true);
  const [aList, setAList] = useState<TAccessoryBasicInfo[] | null>(null);
  const bottom = useSafeAreaPaddingBottom();

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
      <TouchableRipple className="flex-1 overflow-hidden p-3" onPress={onPress}>
        <>
          <View className="self-center">
            <FastImage
              className="aspect-square w-[78px]"
              source={{uri: imgItem(item.basicInfo.iconID)}}
            />
            <FastImage
              className="absolute aspect-square w-[78px]"
              source={frame}
            />
          </View>
          {item.basicInfo.cards.length > 0 && (
            <View className="mt-3 flex-row justify-center">
              {item.basicInfo.cards.map(c => {
                return (
                  <FastImage
                    key={`asg_${c}`}
                    className="aspect-stage-girl w-7 rounded"
                    source={{uri: imgStageGirl(c)}}
                  />
                );
              })}
            </View>
          )}
        </>
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

export default AccessoriesScreen;
