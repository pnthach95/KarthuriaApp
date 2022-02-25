import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import API, { links } from '~/api';
import { charaterImg, schoolIcon } from '~/api/images';
import Kirin from '~/components/kirin';
import ErrorView from '~/components/errorview';
import AppStyles, { padding } from '~/theme/styles';

import type {
  TCharaBasicInfo,
  TCharaList,
  RootStackScreenProps,
} from '~/typings';

const styles = StyleSheet.create({
  img: {
    height: 100,
    width: responsiveScreenWidth(50),
  },
  item: {
    paddingBottom: padding,
  },
  schoolIcon: {
    marginRight: padding / 2,
  },
});

const Characters = ({ navigation }: RootStackScreenProps<'Characters'>) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [charaList, setCharaList] = useState<TCharaBasicInfo[]>([]);
  const bottom = {
    paddingBottom: insets.bottom,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TCharaList>(links.LIST.CHARA);
        if (data.ok && data.data) {
          setCharaList(Object.values(data.data));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = useCallback(
    ({ basicInfo: { charaID } }: TCharaBasicInfo) => `chID_${charaID}`,
    [],
  );

  const renderItem = useCallback(({ item }: { item: TCharaBasicInfo }) => {
    const { charaID, name_ruby, school_id } = item.basicInfo;
    if (name_ruby.ja) {
      const goToDetail = () =>
        navigation.navigate('CharacterDetail', {
          id: charaID,
        });

      const charaImgSource = { uri: charaterImg(charaID) };
      const schoolIconSource = { uri: schoolIcon(school_id) };

      return (
        <TouchableRipple onPress={goToDetail}>
          <View style={[AppStyles.center, styles.item]}>
            <FastImage source={charaImgSource} style={styles.img} />
            <View style={AppStyles.row}>
              <FastImage
                source={schoolIconSource}
                style={[AppStyles.square20, styles.schoolIcon]}
              />
              <Text>{name_ruby.ja}</Text>
            </View>
          </View>
        </TouchableRipple>
      );
    }
    return null;
  }, []);

  if (loading) {
    return <Kirin />;
  }

  if (charaList.length > 0) {
    return (
      <FlatList
        data={charaList}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={bottom}
        columnWrapperStyle={AppStyles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return <ErrorView />;
};

Characters.whyDidYouRender = true;

export default Characters;
