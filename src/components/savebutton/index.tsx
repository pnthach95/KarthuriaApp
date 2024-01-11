import React, {useState} from 'react';
import {IconButton, Tooltip} from 'react-native-paper';
import {onDownloadImage} from 'utils';

type Props = {
  path: string;
  filename: string;
  tintColor?: string;
  pressColor?: string;
};

const SaveButton = ({path, filename, tintColor, pressColor}: Props) => {
  const [saving, setSaving] = useState(false);

  const onPress = async () => {
    setSaving(true);
    await onDownloadImage(path, filename);
    setSaving(false);
  };

  return (
    <Tooltip title="Save image">
      <IconButton
        disabled={saving}
        icon="content-save"
        iconColor={tintColor}
        rippleColor={pressColor}
        onPress={onPress}
      />
    </Tooltip>
  );
};

export default SaveButton;
