import {CachedImage} from '@georstat/react-native-image-cache';
import API, {links} from 'api';
import {charaterImg, schoolIcon} from 'api/images';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles, {padding} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

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

const keyExtractor = ({basicInfo: {charaID}}: TCharaBasicInfo) =>
  `chID_${charaID}`;

const CharactersScreen = ({navigation}: RootStackScreenProps<'Characters'>) => {
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
    loadData();
  }, []);

  const renderItem = useCallback(({item}: {item: TCharaBasicInfo}) => {
    const {charaID, name_ruby, school_id} = item.basicInfo;
    if (name_ruby.ja) {
      const goToDetail = () =>
        navigation.navigate('CharacterDetail', {
          id: charaID,
        });

      return (
        <TouchableRipple onPress={goToDetail}>
          <View style={[AppStyles.center, styles.item]}>
            <CachedImage source={charaterImg(charaID)} style={styles.img} />
            <View style={AppStyles.row}>
              <CachedImage
                source={schoolIcon(school_id)}
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
        columnWrapperStyle={AppStyles.columnWrapper}
        contentContainerStyle={bottom}
        data={charaList}
        keyExtractor={keyExtractor}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return <ErrorView />;
};

CharactersScreen.whyDidYouRender = true;

export default CharactersScreen;
