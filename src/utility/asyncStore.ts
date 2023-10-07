import AsyncStorage from '@react-native-async-storage/async-storage';
import {LIST_TOPICS, LIST_TRANSPORTS} from 'asset';
import dayjs from 'dayjs';
import {ASYNC_TYPE} from '../asset/enum';
import {formatUTCDate} from './format';

interface ActiveUser {
  username: string;
  password: string;
  token: string;
  refreshToken: string;
}

export default class AppAsyncStorage {
  static getAccounts = async (): Promise<TypeAccount[]> => {
    const temp = await AsyncStorage.getItem(ASYNC_TYPE.storageAcc);
    if (temp) {
      return JSON.parse(temp);
    }
    return [];
  };

  static addStorageAcc = async (account: TypeAccount) => {
    const currentAccounts = await AppAsyncStorage.getAccounts();

    for (let i = 0; i < currentAccounts.length; i++) {
      if (currentAccounts[i].username === account.username) {
        currentAccounts[i].password = account.password;
        await AsyncStorage.setItem(
          ASYNC_TYPE.storageAcc,
          JSON.stringify(currentAccounts),
        );
        return;
      }
    }

    currentAccounts.push(account);
    await AsyncStorage.setItem(
      ASYNC_TYPE.storageAcc,
      JSON.stringify(currentAccounts),
    );
  };

  private static editAccount = async (updateAccount: TypeAccount) => {
    const currentAccounts = await AppAsyncStorage.getAccounts();
    const updateAccounts = currentAccounts.map(item => {
      if (item.username !== updateAccount.username) {
        return item;
      }
      return updateAccount;
    });
    await AsyncStorage.setItem(
      ASYNC_TYPE.storageAcc,
      JSON.stringify(updateAccounts),
    );
  };

  static deleteAccount = async (username: string) => {
    const currentAccounts = await AppAsyncStorage.getAccounts();
    const newAccounts = currentAccounts.filter(
      item => item.username !== username,
    );
    await AsyncStorage.setItem(
      ASYNC_TYPE.storageAcc,
      JSON.stringify(newAccounts),
    );
  };

  /**
   *  ACTIVE USER
   */
  static getActiveUser = async (): Promise<ActiveUser | null> => {
    const temp = await AsyncStorage.getItem(ASYNC_TYPE.activeUser);
    if (temp === null) {
      return null;
    }
    return JSON.parse(temp);
  };
  static updateActiveUser = async (params: Partial<ActiveUser>) => {
    const activeUser = await this.getActiveUser();
    if (activeUser) {
      const newUser: ActiveUser = {
        ...activeUser,
        ...params,
      };
      await AsyncStorage.setItem(
        ASYNC_TYPE.activeUser,
        JSON.stringify(newUser),
      );
      await this.editAccount({
        username: newUser.username,
        password: newUser.password,
      });
    }
  };
  static setActiveUser = async (user: ActiveUser) => {
    await AsyncStorage.setItem(ASYNC_TYPE.activeUser, JSON.stringify(user));
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
   * Search params
   */
  static getSearchParams = async (): Promise<TypeSearchParams> => {
    const res: TypeSearchRequest = JSON.parse(
      (await AsyncStorage.getItem(ASYNC_TYPE.searchParams)) || '{}',
    );
    return {
      text_search: '',
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
  };

  // clear all
  static clearAll = async () => {
    await AsyncStorage.clear();
  };
}
