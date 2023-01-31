import {apiGetPassport, apiGetResource} from 'api/module';
import {useAppSelector} from 'app-redux/store';
import {useEffect, useState} from 'react';
import {chooseLanguageFromId, logger} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';
import Redux from './useRedux';

const useInitApp = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const {token, isLogOut} = useAppSelector(state => state.logicSlice);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isInApp = modeExp || !!token;

  useEffect(() => {
    const initApp = async () => {
      try {
        const activeUser = await FindmeAsyncStorage.getActiveUser();

        const handleNotHaveActiveUser = async () => {
          await FindmeAsyncStorage.logOut();
          I18Next.changeLanguage(await FindmeAsyncStorage.getLanguageModeExp());
        };

        if (activeUser?.token) {
          // although activeUser still save in async from last login
          // but "index" not have -> handleNotHaveActiveUser and clear that user
          const index = await FindmeAsyncStorage.getIndexNow();
          const isHavingSocialAccount =
            await FindmeAsyncStorage.getIsHavingSocialAccount();

          // If both username - password and socialLoginAccount not saved
          if (index === null && !isHavingSocialAccount) {
            await handleNotHaveActiveUser();
            return;
          }

          const passport = await apiGetPassport();
          const resource = await apiGetResource();

          Redux.updatePassport(passport.data);
          // passport must be above token to set in SocketProvider
          Redux.setNumberNewNotifications(passport.data.numberNewNotifications);
          Redux.setToken(activeUser.token);
          Redux.setModeExp(false);
          Redux.updateResource(resource.data);
          I18Next.changeLanguage(
            chooseLanguageFromId(passport.data.setting.language),
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
      Redux.setIsLogOut(false);
    }
  }, [isLogOut]);

  return {
    loading,
    error,
    isInApp,
  };
};

export default useInitApp;
