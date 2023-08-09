import {apiGetPassport, apiGetResource} from 'api/discovery';
import {
  logOut,
  setIsLogOut,
  setModeExp,
  setNumberNewNotifications,
  setToken,
  updatePassport,
  updateResource,
} from 'app-redux/actions';
import {useAppSelector} from 'app-redux/store';
import {useEffect, useState} from 'react';
import {chooseLanguageFromId, logger} from 'utility/assistant';
import AsyncStorage from 'utility/asyncStore';
import I18Next from 'utility/I18Next';

const useInitApp = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const {token, isLogOut} = useAppSelector(state => state.logicSlice);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isInApp = modeExp || !!token;

  useEffect(() => {
    const initApp = async () => {
      try {
        const activeUser = await AsyncStorage.getActiveUser();

        if (activeUser) {
          const passport = await apiGetPassport();
          const resource = await apiGetResource();

          updatePassport(passport.data);
          // passport must be above token to set in SocketProvider
          setNumberNewNotifications(passport?.data.numberNewNotifications);
          setToken(activeUser?.token);
          setModeExp(false);
          updateResource(resource?.data);
          I18Next.changeLanguage(
            chooseLanguageFromId(passport?.data?.profile?.language),
          );
        } else {
          const savedLanguage = await AsyncStorage.getLanguageModeExp();
          I18Next.changeLanguage(savedLanguage);
        }
      } catch (err) {
        setError(true);
        logger(err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // isLogOut to check if token blackListed, set initLoading = false to return LoginRoute, if not it will be stuck in LoadingScreen
  useEffect(() => {
    if (isLogOut) {
      setLoading(false);
      setIsLogOut(false);
    }
  }, [isLogOut]);

  const forceLogOut = async () => {
    setLoading(true);
    await AsyncStorage.logOut();
    logOut();
    setError(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    isInApp,
    forceLogOut,
  };
};

export default useInitApp;
