import AsyncStorage from '@react-native-async-storage/async-storage';
import {LIST_TOPICS, LIST_TRANSPORTS} from 'asset';
import dayjs from 'dayjs';
import {ASYNC_TYPE, TOPIC} from '../asset/enum';
import {formatUTCDate} from './format';

interface ActiveUserType {
  username?: string;
  password?: string;
  token?: string;
  refreshToken?: string;
}
export default class AppAsyncStorage {
  /**
   *  GET, ADD, DELETE OR EDIT LIST STORAGE ACCOUNT
   */
  // return to Array of object of AccountSaveToAsync
  static getStorageAcc = async () => {
    let result: Array<AccountSavedAsync> = [];
    const tempt = await AsyncStorage.getItem(ASYNC_TYPE.storageAcc);
    if (tempt !== null) {
      tempt.split('},{').map(item => {
        if (item[0] !== '{') {
          item = '{'.concat(item);
        }
        if (item[item.length - 1] !== '}') {
          item = item.concat('}');
        }
        const itemJson = JSON.parse(item);
        result.push(itemJson);
      });
    }
    return result;
  };
  static getStorageAccAtIndex = async (index: number) => {
    // remember switch from string to date
  };
  static addStorageAcc = async (account: AccountSavedAsync) => {
    let tempt = await AppAsyncStorage.getStorageAcc();
    /**
     * If this account have been saved in storage,
     * only need to set "index" and return
     */
    for (let i = 0; i < tempt.length; i++) {
      if (tempt[i].username === account.username) {
        AppAsyncStorage.setIndexNow(i);
        return;
      }
    }

    const result: Array<any> = [];
    tempt.forEach(item => result.push(JSON.stringify(item)));
    result.push(JSON.stringify(account));
    await AsyncStorage.setItem(ASYNC_TYPE.storageAcc, result.toString());
    await AppAsyncStorage.setIndexNow(result.length - 1);
  };

  static editIndexNowAccount = async (newInfo: Partial<AccountSavedAsync>) => {
    const indexNow = await AppAsyncStorage.getIndexNow();
    if (indexNow === null) {
      return;
    }

    const listAccount = await AppAsyncStorage.getStorageAcc();
    listAccount[indexNow] = {...listAccount[indexNow], ...newInfo};
    let result: Array<any> = [];
    listAccount.forEach(item => result.push(JSON.stringify(item)));
    await AsyncStorage.setItem(ASYNC_TYPE.storageAcc, result.toString());
  };

  static deleteAccAtIndex = async (index: number) => {
    const listAccount = await AppAsyncStorage.getStorageAcc();
    listAccount.splice(index, 1);

    const result: Array<any> = [];
    listAccount.forEach(item => result.push(JSON.stringify(item)));
    await AsyncStorage.setItem(ASYNC_TYPE.storageAcc, result.toString());
  };
  /**
   * ---------------------------------------------
   */
  /**
   *  ACTIVE USER
   */
  static getActiveUser = async (): Promise<ActiveUserType> => {
    const temp = await AsyncStorage.getItem(ASYNC_TYPE.activeUser);
    if (temp === null) {
      return {};
    }
    return JSON.parse(temp);
  };
  static updateActiveUser = async (params: ActiveUserType) => {
    const activeUser = await this.getActiveUser();
    const newUser = {
      ...activeUser,
      ...params,
    };
    await AsyncStorage.setItem(ASYNC_TYPE.activeUser, JSON.stringify(newUser));
  };
  /**
   *   Edit language for Mode No Account
   */
  static getLanguageModeExp = async () => {
    const tempt = await AsyncStorage.getItem(ASYNC_TYPE.language);

    if (!tempt) {
      await AsyncStorage.setItem(ASYNC_TYPE.language, 'vi');
      return 'vi';
    }
    return tempt;
  };
  static editLanguageModeExp = async (updateLanguage: string) => {
    await AsyncStorage.setItem(ASYNC_TYPE.language, updateLanguage);
  };
  /**
   * ---------------------------------------------
   */

  /**
   * Index of logged acc in async accounts
   */
  static getIndexNow = async () => {
    const index = await AsyncStorage.getItem(ASYNC_TYPE.index);
    if (index === null) {
      return null;
    }
    return parseInt(index, 10);
  };
  static setIndexNow = async (value: number) => {
    await AsyncStorage.setItem(ASYNC_TYPE.index, value.toString());
  };
  /**
   * ---------------------------------------------
   */

  /**
   * Check is saving login social account
   */
  static getIsHavingSocialAccount = async () => {
    const socialLoginAccount = await AsyncStorage.getItem(
      ASYNC_TYPE.socialLoginAccount,
    );
    if (socialLoginAccount === null) {
      return false;
    }
    return true;
  };

  static setIsHavingSocialAccount = async (value: boolean) => {
    await AsyncStorage.setItem(ASYNC_TYPE.socialLoginAccount, String(value));
  };

  /**
   * Search params
   */
  static getSearchParams = async (): Promise<TypeSearchParams> => {
    const res: TypeSearchRequest = JSON.parse(
      (await AsyncStorage.getItem(ASYNC_TYPE.searchParams)) || '{}',
    );
    return {
      location: '',
      start_location: res?.start_location || 'Ha Noi',
      number_people: res?.number_people || 2,
      services: res?.services || LIST_TOPICS.map(item => item.id),
      transports: res?.transports || LIST_TRANSPORTS.map(item => item.id),
      start_time: formatUTCDate(dayjs()),
      end_time: formatUTCDate(dayjs().add(2, 'days')),
      start_price: res?.start_price || 0,
      end_price: res?.end_price || 5000000,
    };
  };

  /**
   * ---------------------------------------------
   */

  // when click log out, will set logged = 'false' and indexNow='-1'
  static logOut = async () => {
    await AsyncStorage.removeItem(ASYNC_TYPE.activeUser);
    await AsyncStorage.removeItem(ASYNC_TYPE.index);
  };

  // clear all
  static clearAll = async () => {
    await AsyncStorage.clear();
  };
}
