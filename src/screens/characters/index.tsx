import {FasterImageView} from '@candlefinance/faster-image';
import API, {links} from 'api';
import {iconSchool, imgCharater} from 'api/images';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const keyExtractor = ({basicInfo: {charaID}}: TCharaBasicInfo) =>
  `chID_${charaID}`;

const styles = StyleSheet.create({
  card: {aspectRatio: 16 / 9, width: '100%'},
  icon: {aspectRatio: 1, width: 20},
});

const CharactersScreen = ({navigation}: RootStackScreenProps<'Characters'>) => {
  const [loading, setLoading] = useState(true);
  const [charaList, setCharaList] = useState<TCharaBasicInfo[]>([]);
  const bottom = useSafeAreaPaddingBottom();

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
    loadData();
  }, []);

  const renderItem = ({item}: {item: TCharaBasicInfo}) => {
    const {charaID, name_ruby, school_id} = item.basicInfo;
    if (name_ruby.ja) {
      const goToDetail = () =>
        navigation.navigate('CharacterDetail', {
          id: charaID,
        });

      return (
        <TouchableRipple className="flex-1" onPress={goToDetail}>
          <View className="items-center justify-center pb-3">
            <FasterImageView
              source={{url: imgCharater(charaID), resizeMode: 'contain'}}
              style={styles.card}
            />
            <View className="flex-row items-center space-x-1">
              <FasterImageView
                source={{url: iconSchool(school_id)}}
                style={styles.icon}
              />
              <Text className="flex-shrink">{name_ruby.ja}</Text>
            </View>
          </View>
        </TouchableRipple>
      );
    }
    return null;
  };

  if (loading) {
    return <Kirin />;
  }

  return (
    <FlatList
      contentContainerStyle={bottom}
      data={charaList}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ErrorView}
      numColumns={2}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CharactersScreen;
