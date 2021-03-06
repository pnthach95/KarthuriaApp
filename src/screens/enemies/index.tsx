import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Image } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { enemyImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import AppStyles from '~/theme/styles';
import { attribute } from '~/assets';

import type { EnemiesProps, TEnemyBasicInfo, TEnemyList } from '~/typings';

const styles = StyleSheet.create({
  attribute: {
    height: 20,
    width: 20,
  },
  frame: {
    height: 112 * 0.8,
    width: 112 * 0.8,
  },
  item: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    padding: 5,
  },
});

const Enemies = ({ navigation }: EnemiesProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [eList, setEList] = useState<TEnemyBasicInfo[]>([]);
  const bottom = {
    paddingBottom: insets.bottom,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TEnemyList>(links.LIST.ENEMY);
        if (data.ok && data.data) {
          setEList(Object.values(data.data));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const keyExtractor = ({ basicInfo }: TEnemyBasicInfo) =>
    `sg_${basicInfo.enemyID}`;

  const renderItem = ({ item }: { item: TEnemyBasicInfo }) => {
    const { basicInfo } = item;
    const onPress = () => {
      navigation.navigate('EnemyDetail', { id: basicInfo.enemyID });
    };

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={[styles.item, { borderColor: colors.border }]}>
          <View style={AppStyles.center}>
            <View style={styles.frame}>
              <FastImage
                source={{
                  uri: enemyImg(basicInfo.icon),
                }}
                style={styles.frame}
              />
              <Image
                source={attribute(basicInfo.attribute)}
                style={[styles.attribute, AppStyles.absolute]}
              />
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  if (loading) {
    return <Kirin />;
  }

  if (eList.length > 0) {
    return (
      <FlatList
        data={eList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={bottom}
        numColumns={2}
        initialNumToRender={16}
      />
    );
  }

  return <ErrorView />;
};

export default Enemies;
