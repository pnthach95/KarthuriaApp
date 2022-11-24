import {iconFieldEffect, skillIcon} from 'api/images';
import Separator from 'components/separator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors, Divider, Paragraph} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyles from 'theme/styles';

type Props = {
  skillParam: TSkillParam;
};

const styles = StyleSheet.create({
  extra: {
    color: Colors.red500,
  },
});

const SkillParam = ({skillParam}: Props) => {
  const {t} = useTranslation();

  return (
    <>
      <Separator />
      <Divider />
      <Separator />
      {skillParam.type === 'fieldEffect' && (
        <>
          <Paragraph>{t('stage-effect')}</Paragraph>
          <Separator />
        </>
      )}
      <View style={AppStyles.row}>
        <FastImage
          source={{
            uri:
              skillParam.type === 'normal'
                ? skillIcon(skillParam.icon)
                : iconFieldEffect(skillParam.icon),
          }}
          style={[AppStyles.square40, AppStyles.marginRight]}
        />
        <View style={AppStyles.flex1}>
          <Paragraph>
            {skillParam.description.en || skillParam.description.ja}
            {skillParam.descriptionExtra && (
              <Paragraph style={styles.extra}>
                {/* eslint-disable-next-line react-native/no-raw-text */}
                {` (${
                  skillParam.descriptionExtra.en ||
                  skillParam.descriptionExtra.ja
                })`}
              </Paragraph>
            )}
          </Paragraph>
          <View style={AppStyles.row}>
            <Icon name="target" size={20} />
            <Paragraph>
              {skillParam.target.en || skillParam.target.ja}
            </Paragraph>
          </View>
          <Divider />
          <View style={AppStyles.rowSpaceBetween}>
            {skillParam.accuracy && (
              <Paragraph>
                {t('accuracy')}
                {skillParam.accuracy}
              </Paragraph>
            )}
            {skillParam.hits && (
              <Paragraph>
                {t('hits')}
                {skillParam.hits}
              </Paragraph>
            )}
            {skillParam.duration && (
              <Paragraph>
                {t('duration')}
                {skillParam.duration.en || skillParam.duration.ja}
              </Paragraph>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default SkillParam;
