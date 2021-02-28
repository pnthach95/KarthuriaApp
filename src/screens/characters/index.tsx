import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
import API, { links } from '~/api';
import { charaterImg, schoolIcon } from '~/api/images';
import AppStyles from '~/theme/styles';

import type {
  TCharaBasicInfo,
  TCharaList,
  CharactersScreenProps,
} from '~/typings';

const styles = StyleSheet.create({
  img: {
    height: 100,
    width: responsiveScreenWidth(50),
  },
  item: {
    paddingBottom: 10,
  },
  schoolIcon: {
    height: 20,
    marginRight: 5,
    width: 20,
  },
});

const Charaters = ({ navigation }: CharactersScreenProps): JSX.Element => {
  const [charaters, setCharaters] = useState<TCharaBasicInfo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await API.get<TCharaList>(links.LIST.CHARA);
      if (data.data) {
        const tmp: TCharaBasicInfo[] = [];
        Object.keys(data.data).forEach((key) => {
          if (data.data) {
            tmp.push(data.data[key]);
          }
        });
        setCharaters(tmp);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = ({ basicInfo: { charaID } }: TCharaBasicInfo) =>
    `chID_${charaID}`;

  const renderItem = ({ item }: { item: TCharaBasicInfo }) => {
    const { charaID, name_ruby, school_id } = item.basicInfo;
    if (name_ruby.ja) {
      const goToDetail = () =>
        navigation.navigate('CharacterDetail', {
          id: charaID,
        });

      return (
        <TouchableRipple onPress={goToDetail}>
          <View style={[AppStyles.center, styles.item]}>
            <FastImage
              source={{ uri: charaterImg(charaID) }}
              style={styles.img}
            />
            <View style={AppStyles.row}>
              <FastImage
                source={{ uri: schoolIcon(school_id) }}
                style={styles.schoolIcon}
              />
              <Text>{name_ruby.ja}</Text>
            </View>
          </View>
        </TouchableRipple>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={charaters}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      columnWrapperStyle={AppStyles.center}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Charaters;
