import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, Caption, Paragraph } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import API, { links } from '~/api';
import { schoolIcon } from '~/api/images';
import { charaBase, charaPortrait } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import Separator from '~/components/separator';
import AppStyles from '~/theme/styles';

import type { CharacterDetailProps, TChara } from '~/typings';

const styles = StyleSheet.create({
  portrait: {
    height: 336,
    width: 212.8,
  },
});

const CharacterDetail = ({ route }: CharacterDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [character, setCharater] = useState<TChara | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TChara>(
          links.CHARA + `${route.params.id}.json`,
        );
        if (data.ok && data.data) {
          setCharater(data.data);
        }
      } catch (error) {
        //
      } finally {
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
            {character.info.name.en || character.info.name.ja}
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
          <View style={AppStyles.padding}>
            <Caption>Birthday (month/day)</Caption>
            <Paragraph>{birthday}</Paragraph>
            <Separator height={10} />
            <Caption>Voice Actor</Caption>
            <Paragraph>
              {character.info.cv.en || character.info.cv.ja}
            </Paragraph>
            <Separator height={10} />
            <View style={AppStyles.rowSpaceBetween}>
              <View>
                <Caption>School</Caption>
                <Paragraph>
                  {character.info.department_1.en ||
                    character.info.department_1.ja}
                </Paragraph>
              </View>
              <FastImage
                source={{ uri: schoolIcon(character.basicInfo.school_id) }}
                style={AppStyles.square40}
              />
            </View>
            <Separator height={10} />
            <Caption>Department</Caption>
            <Paragraph>
              {character.info.department_2.en || character.info.department_2.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>Liked Food</Caption>
            <Paragraph>
              {character.info.like_foods.en || character.info.like_foods.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>Disliked Food</Caption>
            <Paragraph>
              {character.info.dislike_foods.en ||
                character.info.dislike_foods.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>Likes</Caption>
            <Paragraph>
              {character.info.likes.en || character.info.likes.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>Dislikes</Caption>
            <Paragraph>
              {character.info.dislikes.en || character.info.dislikes.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>Introduction</Caption>
            <Paragraph>
              {character.info.introduction.en || character.info.introduction.ja}
            </Paragraph>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

CharacterDetail.whyDidYouRender = true;

export default CharacterDetail;
