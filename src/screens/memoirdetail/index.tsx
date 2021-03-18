import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  Caption,
  Headline,
  Text,
  Paragraph,
  Surface,
  TouchableRipple,
  Subheading,
  DataTable,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import API, { links } from '~/api';
import { charaIcon, memoirBigImg, skillIcon } from '~/api/images';
import { rarity } from '~/assets';
import BaseScreen from '~/components/basescreen';
import AppStyles, { borderRadius, padding } from '~/theme/styles';
import frame from '~/assets/common/frame_thumbnail_equip.png';

import type { OnLoadEvent } from 'react-native-fast-image';
import type { MemoirDetailProps, TEquip } from '~/typings';

const styles = StyleSheet.create({
  block: {
    borderRadius,
    marginVertical: padding,
    padding,
  },
  charaIconContainer: {
    marginLeft: padding,
  },
  frameBorderRadius: {
    borderRadius: borderRadius * 2,
  },
  rarity: {
    bottom: padding / 2,
    left: padding / 2,
  },
  table: {
    borderRadius,
    marginVertical: padding,
  },
});

const MemoirDetail = ({
  route,
  navigation,
}: MemoirDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [memoir, setMemoir] = useState<TEquip | null>(null);
  const [raritySize, setRaritySize] = useState({ height: 28, width: 140 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TEquip>(
          links.EQUIP + route.params.id + '.json',
        );
        if (gotData.ok && gotData.data) {
          setMemoir(gotData.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const onLoad = (e: OnLoadEvent) =>
    setRaritySize({
      height: e.nativeEvent.height * 0.2,
      width: e.nativeEvent.width * 0.2,
    });

  const releasedJA = memoir && dayjs(memoir.basicInfo.published.ja * 1000);
  const releasedWW = memoir && dayjs(memoir.basicInfo.published.ww * 1000);

  return (
    <BaseScreen loading={loading} hasData={!!memoir}>
      {memoir && (
        <View style={AppStyles.paddingHorizontal}>
          <Headline style={AppStyles.centerText}>
            {memoir.basicInfo.name.en || memoir.basicInfo.name.ja}
          </Headline>
          <View style={AppStyles.bigImg}>
            <FastImage
              source={{ uri: memoirBigImg(memoir.basicInfo.cardID) }}
              style={[AppStyles.bigImg, styles.frameBorderRadius]}
            />
            <Image
              source={frame}
              style={[AppStyles.bigImg, AppStyles.absolute]}
            />
            <FastImage
              source={rarity(memoir.basicInfo.rarity)}
              resizeMode='contain'
              onLoad={onLoad}
              style={[styles.rarity, AppStyles.absolute, raritySize]}
            />
          </View>
          <Surface style={[AppStyles.shadow, styles.block]}>
            <View style={[AppStyles.row, AppStyles.spaceBetween]}>
              <Caption>Characters</Caption>
              <View style={AppStyles.row}>
                {Array.isArray(memoir.basicInfo.charas) ? (
                  memoir.basicInfo.charas.map((chara) => {
                    const source = { uri: charaIcon(chara) };
                    const onPress = () =>
                      navigation.navigate('CharacterDetail', { id: chara });
                    return (
                      <TouchableRipple
                        key={`chara_${chara}`}
                        onPress={onPress}
                        style={styles.charaIconContainer}>
                        <FastImage source={source} style={AppStyles.square40} />
                      </TouchableRipple>
                    );
                  })
                ) : (
                  <Text>No characters appear on this memoir!</Text>
                )}
              </View>
            </View>
            <Caption>Released</Caption>
            {releasedJA && (
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Text>Japanese</Text>
                <Text>{releasedJA.format('LLLL')}</Text>
              </View>
            )}
            {releasedWW && (
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Text>Worldwide</Text>
                <Text>{releasedWW.format('LLLL')}</Text>
              </View>
            )}
          </Surface>
          <Subheading style={AppStyles.centerText}>Stats</Subheading>
          <Surface style={[AppStyles.shadow, styles.table]}>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Power Score (Total)</DataTable.Cell>
                <DataTable.Cell numeric>{memoir.stat.total}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>HP</DataTable.Cell>
                <DataTable.Cell numeric>{memoir.stat.hp}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Act Power</DataTable.Cell>
                <DataTable.Cell numeric>{memoir.stat.atk}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Normal Defense</DataTable.Cell>
                <DataTable.Cell numeric>{memoir.stat.pdef}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Special Defense</DataTable.Cell>
                <DataTable.Cell numeric>{memoir.stat.mdef}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Surface>
          <Subheading style={AppStyles.centerText}>Auto Skills</Subheading>
          <Surface style={[AppStyles.shadow, styles.block]}>
            <View style={AppStyles.row}>
              <FastImage
                source={{ uri: skillIcon(memoir.skill.iconID) }}
                style={[AppStyles.square40, AppStyles.marginRight]}
              />
              <View style={AppStyles.flex1}>
                <Paragraph>
                  {memoir.skill.info.en || memoir.skill.info.ja}
                </Paragraph>
              </View>
            </View>
          </Surface>
          <Subheading style={AppStyles.centerText}>Introduction</Subheading>
          <Surface style={[AppStyles.shadow, styles.block]}>
            <Paragraph>
              {memoir.basicInfo.profile.en || memoir.basicInfo.profile.ja}
            </Paragraph>
          </Surface>
        </View>
      )}
    </BaseScreen>
  );
};

export default MemoirDetail;
