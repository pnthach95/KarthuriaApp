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
  const description =
    (skillParam.name ? `${skillParam.name?.en || skillParam.name?.ja}\n` : '') +
    (Array.isArray(skillParam.description)
      ? skillParam.description.map(d => d.en || d.ja).join('\n')
      : skillParam.description
      ? skillParam.description?.en || skillParam.description?.ja
      : '');

  return (
    <>
      <Divider className="my-3" />
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
            {description}
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
          {(skillParam.accuracy || skillParam.hits || skillParam.duration) && (
            <>
              <Divider className="my-2" />
              <View className="flex-1 flex-row flex-wrap items-center justify-between">
                {skillParam.accuracy && (
                  <Text variant="labelMedium">
                    {t('accuracy')}
                    {skillParam.accuracy}
                  </Text>
                )}
                {skillParam.hits && (
                  <Text variant="labelMedium">
                    {t('hits')}
                    {skillParam.hits}
                  </Text>
                )}
                {skillParam.duration && (
                  <Text variant="labelMedium">
                    {t('duration')}
                    {skillParam.duration.en || skillParam.duration.ja}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
};

export default SkillParam;
