import {FasterImageView} from '@candlefinance/faster-image';
import API, {links} from 'api';
import {iconAttribute, imgEnemy} from 'api/images';
import Kirin from 'components/kirin';
import SkillDetail from 'components/skilldetail';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  icon: {alignSelf: 'center', aspectRatio: 1, width: 112},
});

const EnemyDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EnemyDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [enemy, setEnemy] = useState<TEnemy | null>(null);
  const contentContainer = useSafeAreaPaddingBottom(0, {padding: 12});

  useEffect(() => {
    if (enemy) {
      navigation.setOptions({
        title: enemy.basicInfo.name.en || enemy.basicInfo.name.ja,
      });
    }
  }, [enemy]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {id} = route.params;
        const response = await API.get<TEnemy>(links.ENEMY + `${id}.json`);
        if (response.ok && response.data) {
          setEnemy(response.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <Kirin />;
  }

  if (enemy) {
    return (
      <ScrollView
        contentContainerStyle={contentContainer}
        showsVerticalScrollIndicator={false}>
        <View className="py-3">
          <View className="aspect-square w-28 self-center">
            <FasterImageView
              source={{url: imgEnemy(enemy.basicInfo.icon)}}
              style={styles.icon}
            />
            <Image
              className="absolute aspect-square w-7"
              source={{uri: iconAttribute(enemy.basicInfo.attribute)}}
            />
          </View>
        </View>
        <View className="py-3">
          <Surface className="my-1 rounded p-3" elevation={3}>
            <Text variant="bodySmall">{t('profile')}</Text>
            <Text variant="bodyMedium">
              {enemy.basicInfo.personality.en || enemy.basicInfo.personality.ja}
            </Text>
          </Surface>
        </View>
        <View className="py-3">
          <Text className="text-center" variant="titleMedium">
            {t('skill')}
          </Text>
          {enemy.skills.map((skill, idx) => {
            return <SkillDetail key={idx} skill={skill.skillNormal} />;
          })}
        </View>
      </ScrollView>
    );
  }
};

export default EnemyDetailScreen;
