import {iconSkill} from 'api/images';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Surface, Text} from 'react-native-paper';

type Props = {
  skill: TNormalSkill;
};

const NormalSkill = ({skill}: Props) => {
  const {t} = useTranslation();

  return (
    <Surface className="my-2 space-y-3 rounded-md p-3" elevation={3}>
      <View className="flex-row">
        <View className="flex-1">
          <Text>{skill.name.en || skill.name.ja}</Text>
        </View>
        <Text>
          {t('ap')}
          {skill.cost}
        </Text>
      </View>
      <View className="flex-row space-x-3">
        <FastImage
          className="aspect-square w-10"
          source={{
            uri: iconSkill(skill.iconID),
          }}
        />
        <View className="flex-1">
          <Text variant="bodyMedium">
            {skill.description?.en || skill.description?.ja}
          </Text>
          <Text variant="bodyMedium">
            {t('ti-va')}
            {skill.skillInfo}
          </Text>
          <Text variant="bodyMedium">
            {t('animation')}
            {skill.skillCycle}
          </Text>
        </View>
      </View>
    </Surface>
  );
};

export default NormalSkill;
