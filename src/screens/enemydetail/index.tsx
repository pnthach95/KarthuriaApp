import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  Headline,
  Subheading,
  Surface,
  Caption,
  Paragraph,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { enemyImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import SkillDetail from '~/components/skilldetail';
import { attribute } from '~/assets';
import AppStyles from '~/theme/styles';

import type { EnemyDetailProps, TEnemy } from '~/typings';

const styles = StyleSheet.create({
  attribute: {
    height: 28,
    width: 28,
  },
  block: {
    paddingVertical: 10,
  },
  container: {
    paddingHorizontal: 10,
  },
  enemyImg: {
    alignSelf: 'center',
    height: 112,
    width: 112,
  },
  surfaceBlock: {
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
  },
});

const EnemyDetail = ({ route }: EnemyDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [enemy, setEnemy] = useState<TEnemy | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = route.params;
        const gotData = await API.get<TEnemy>(links.ENEMY + `${id}.json`);
        if (gotData.ok && gotData.data) {
          setEnemy(gotData.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <BaseScreen loading={loading} hasData={!!enemy}>
      {enemy && (
        <>
          <Headline style={AppStyles.centerText}>
            {enemy.basicInfo.name.en || enemy.basicInfo.name.ja}
          </Headline>
          <View style={styles.block}>
            <View style={styles.enemyImg}>
              <FastImage
                source={{ uri: enemyImg(enemy.basicInfo.icon) }}
                style={styles.enemyImg}
              />
              <Image
                source={attribute(enemy.basicInfo.attribute)}
                style={[styles.attribute, AppStyles.absolute]}
              />
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.block}>
              <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
                <Caption>Profile</Caption>
                <Paragraph>
                  {enemy.basicInfo.personality.en ||
                    enemy.basicInfo.personality.ja}
                </Paragraph>
              </Surface>
            </View>
            <View style={styles.block}>
              <Subheading style={AppStyles.centerText}>Skill</Subheading>
              {Object.keys(enemy.skills).map((k) => {
                const skill = enemy.skills[k];
                return <SkillDetail key={k} skill={skill.normalSkill} />;
              })}
            </View>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

export default EnemyDetail;
