import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Switch, TouchableRipple, Colors } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContext from '~/context';

import type { AppOptions, MoreScreenProps } from '~/typings';

const MoreScreen: React.FC<MoreScreenProps> = () => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useContext(AppContext);
  const top = { paddingTop: insets.top };

  /** Toggle dark theme */
  const themeToggle = () => {
    const data: AppOptions = {
      ...state.options,
      isDark: !state.options.isDark,
    };
    dispatch({ type: 'SAVE_OPTIONS', data });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={top}>
      <View style={styles.group}>
        <Text style={styles.headline}>Options</Text>
      </View>
      <TouchableRipple onPress={themeToggle}>
        <View style={styles.settingRow}>
          <Text>Dark theme</Text>
          <Switch value={state.options.isDark} onValueChange={themeToggle} />
        </View>
      </TouchableRipple>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  group: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headline: {
    color: Colors.blue600,
    fontWeight: 'bold',
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default MoreScreen;
