import {iconFieldEffect, iconSkill} from 'api/images';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  skillParam: TSkillParam;
};

const SkillParam = ({skillParam}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <>
      <View className="h-3" />
      <Divider />
      <View className="h-3" />
      {skillParam.type === 'fieldEffect' && (
        <>
          <Text variant="bodyMedium">{t('stage-effect')}</Text>
          <View className="h-3" />
        </>
      )}
      <View className="flex-row space-x-3">
        <FastImage
          className="aspect-square w-10"
          source={{
            uri:
              skillParam.type === 'normal'
                ? iconSkill(skillParam.icon)
                : iconFieldEffect(skillParam.icon),
          }}
        />
        <View className="flex-1">
          <Text variant="bodyMedium">
            {skillParam.description?.en || skillParam.description?.ja}
            {skillParam.descriptionExtra && (
              <Text className="text-red-500" variant="bodyMedium">
                {` (${
                  skillParam.descriptionExtra.en ||
                  skillParam.descriptionExtra.ja
                })`}
              </Text>
            )}
          </Text>
          <View className="flex-row">
            <Icon color={colors.onBackground} name="target" size={20} />
            <Text variant="bodyMedium">
              {skillParam.target.en || skillParam.target.ja}
            </Text>
          </View>
          <Divider />
          <View className="flex-row items-center justify-between">
            {skillParam.accuracy && (
              <Text variant="bodyMedium">
                {t('accuracy')}
                {skillParam.accuracy}
              </Text>
            )}
            {skillParam.hits && (
              <Text variant="bodyMedium">
                {t('hits')}
                {skillParam.hits}
              </Text>
            )}
            {skillParam.duration && (
              <Text variant="bodyMedium">
                {t('duration')}
                {skillParam.duration.en || skillParam.duration.ja}
              </Text>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default SkillParam;
