import {apiGetPassport, apiGetResource} from 'api/discovery';
import {
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

        const handleNotHaveActiveUser = async () => {
          await AsyncStorage.logOut();
          I18Next.changeLanguage(await AsyncStorage.getLanguageModeExp());
        };

        if (activeUser?.token) {
          // although activeUser still save in async from last login
          // but "index" not have -> handleNotHaveActiveUser and clear that user
          const index = await AsyncStorage.getIndexNow();
          const isHavingSocialAccount =
            await AsyncStorage.getIsHavingSocialAccount();

          // If both username - password and socialLoginAccount not saved
          if (index === null && !isHavingSocialAccount) {
            await handleNotHaveActiveUser();
            return;
          }

          const {data: passport} = await apiGetPassport();
          const resource = await apiGetResource();

          updatePassport({
            profile: passport?.profile,
            information: passport?.information,
            setting: passport?.setting,
          });
          // passport must be above token to set in SocketProvider
          setNumberNewNotifications(passport?.numberNewNotifications);
          setToken(activeUser?.token);
          setModeExp(false);
          updateResource(resource?.data);
          I18Next.changeLanguage(
            chooseLanguageFromId(passport?.setting?.language),
          );
        } else {
          await handleNotHaveActiveUser();
        }

        setLoading(false);
      } catch (err) {
        setError(true);
        logger(err);
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

  return {
    loading,
    error,
    isInApp,
  };
};

export default useInitApp;
