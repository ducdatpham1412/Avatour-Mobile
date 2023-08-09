import {setToken} from 'app-redux';
import Store from 'app-redux/store';
import {ERROR_KEY_ENUM} from 'asset/enum';
import Config from 'asset/env';
import axios, {InternalAxiosRequestConfig} from 'axios';
import {logger} from 'utility/assistant';
import AsyncStorage from 'utility/asyncStore';
import {logOut} from 'utility/authentication';

const baseURL = Config.API_URL;

const AUTH_URL_REFRESH_TOKEN = `${baseURL}/auth/refresh-token`;

const request = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    Accept: '*/*',
  },
});

// for multiple requests
let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: string | null | undefined = null) => {
  failedQueue.forEach((item: any) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });

  failedQueue = [];
};

request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config?.headers?.Authorization) {
      return config;
    }
    // Do something before api is sent
    let token: any = Store.getState().logicSlice.token;
    if (!token) {
      const activeUser = await AsyncStorage.getActiveUser();
      token = activeUser?.token;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => {
    // Do something with api error
    logger(
      `%c FAILED ${error.response.method?.toUpperCase()} from ${
        error.response.config.url
      }:`,
    );
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response: any) => response.data,

  async (error: any) => {
    const {response, config} = error || {};
    const {data} = response || {};
    const {errorMessage, errorKey} = data || {};

    logger('Response error: ', errorMessage);

    if (errorKey === ERROR_KEY_ENUM.token_expired && !config.retry) {
      // if is refreshing token in other request
      if (isRefreshing) {
        try {
          const queuePromise: any = await new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          });
          config.headers.Authorization = `Bearer ${queuePromise.token}`;
          return request(config);
        } catch (err) {
          return Promise.reject(String(err));
        }
      }

      logger('Refreshing token');
      config.retry = true;
      isRefreshing = true;

      const activeUser = await AsyncStorage.getActiveUser();
      try {
        const res = await axios.post(AUTH_URL_REFRESH_TOKEN, {
          refresh: activeUser?.refreshToken,
        });
        const newToken = res.data.data.access;

        await AsyncStorage.updateActiveUser({token: newToken});
        setToken(newToken);

        config.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return request(config);
      } catch (err) {
        // handle when refreshing token, refresh is blacked list
        const temp: any = err;
        const _error = temp.response.data;
        if (_error.errorKey === ERROR_KEY_ENUM.token_blacklisted) {
          logOut();
        }
        return Promise.reject(_error.errorMessage);
      } finally {
        isRefreshing = false;
      }
    }

    error.message = errorMessage || 'Have some errors';
    error.keyMessage = errorKey || 0;
    return Promise.reject(String(error.message));
  },
);

export default request;
