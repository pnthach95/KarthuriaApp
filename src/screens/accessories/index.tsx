import {FasterImageView} from '@candlefinance/faster-image';
import API, {links} from 'api';
import {imgItem, imgStageGirl} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const keyExtractor = (item: TAccessoryBasicInfo) =>
  `acc_${item.basicInfo.accID}`;

const styles = StyleSheet.create({
  card: {aspectRatio: 144 / 160, borderRadius: 4, width: 28},
  icon: {aspectRatio: 1, width: 78},
});

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
            <FasterImageView
              source={{url: imgItem(item.basicInfo.iconID)}}
              style={styles.icon}
            />
            <Image className="absolute aspect-square w-[78px]" source={frame} />
          </View>
          {item.basicInfo.cards.length > 0 && (
            <View className="mt-3 flex-row justify-center">
              {item.basicInfo.cards.map(c => {
                return (
                  <FasterImageView
                    key={`asg_${c}`}
                    source={{url: imgStageGirl(c)}}
                    style={styles.card}
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
