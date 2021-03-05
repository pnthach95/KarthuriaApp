import MMKVStorage from 'react-native-mmkv-storage';

type TKey = 'options';

const MMKV = new MMKVStorage.Loader().withInstanceID('appoptions').initialize();

const getString = async (key: TKey): Promise<string> => {
  try {
    const s = await MMKV.getStringAsync(key);
    // Debug(`mmkv getString ${key}`, s);
    return s || '';
  } catch (error) {
    // console.log(`mmkv getString ${key} error`, error);
    return '';
  }
};

const setString = async (key: TKey, value: string): Promise<void> => {
  try {
    await MMKV.setStringAsync(key, value);
  } catch (error) {
    // console.log(`mmkv setString ${key} error`, error);
  }
};

const getObject = async <T>(key: TKey): Promise<T | null> => {
  try {
    const o = await MMKV.getMapAsync(key);
    return (o as unknown) as T;
  } catch (error) {
    // console.log(`mmkv getObject ${key} error`, error);
    return null;
  }
};

const setObject = async <T>(key: TKey, value: T): Promise<void> => {
  try {
    await MMKV.setMapAsync(key, value as Record<string, unknown>);
  } catch (error) {
    // console.log(`mmkv setObject ${key} error`, error);
  }
};

const remove = async (key: TKey): Promise<void> => {
  try {
    await MMKV.removeItem(key);
  } catch (error) {
    // console.log(`mmkv remove ${key} error`, error);
  }
};

export { getString, setString, getObject, setObject, remove };
