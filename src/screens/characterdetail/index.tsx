import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Headline, Caption } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import API, { links } from '~/api';
import { schoolIcon } from '~/api/images';
import { charaBase, charaPortrait } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import AppStyles from '~/theme/styles';

import type { CharacterDetailProps, TChara } from '~/typings';

const styles = StyleSheet.create({
  padding: {
    padding: 10,
  },
  portrait: {
    height: 480 * 0.7,
    width: 304 * 0.7,
  },
  schoolIcon: {
    height: 40,
    width: 40,
  },
  schoolRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const CharacterDetail = ({ route }: CharacterDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [character, setCharater] = useState<TChara | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await API.get<TChara>(
        links.CHARA + `${route.params.id}.json`,
      );
      if (data.data) {
        setCharater(data.data);
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const birthday = character
    ? dayjs()
        .date(character.basicInfo.birth_day)
        .month(character.basicInfo.birth_month)
        .format('M/D')
    : '';

  return (
    <BaseScreen hasData={!!character} loading={loading}>
      {character && (
        <>
          <Headline style={AppStyles.centerText}>
            {character.info.name.en}
          </Headline>
          <View style={AppStyles.center}>
            <FastImage
              source={{ uri: charaBase(character.basicInfo.charaID) }}
              style={styles.portrait}
            />
            <FastImage
              source={{ uri: charaPortrait(character.basicInfo.charaID) }}
              style={[styles.portrait, AppStyles.absolute]}
            />
          </View>
          <View style={styles.padding}>
            <Caption>Birthday (month/day)</Caption>
            <Text>{birthday}</Text>
            <Caption>Voice Actor</Caption>
            <Text>{character.info.cv.en}</Text>
            <View style={styles.schoolRow}>
              <View>
                <Caption>School</Caption>
                <Text>{character.info.department_1.en}</Text>
              </View>
              <FastImage
                source={{ uri: schoolIcon(character.basicInfo.school_id) }}
                style={styles.schoolIcon}
              />
            </View>
            <Caption>Department</Caption>
            <Text>{character.info.department_2.en}</Text>
            <Caption>Liked Food</Caption>
            <Text>{character.info.like_foods.en}</Text>
            <Caption>Disliked Food</Caption>
            <Text>{character.info.dislike_foods.en}</Text>
            <Caption>Likes</Caption>
            <Text>{character.info.likes.en}</Text>
            <Caption>Dislikes</Caption>
            <Text>{character.info.dislikes.en}</Text>
            <Caption>Introduction</Caption>
            <Text>{character.info.introduction.en}</Text>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

export default CharacterDetail;
