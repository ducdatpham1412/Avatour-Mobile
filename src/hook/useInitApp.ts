import {apiGetPassport, apiGetResource} from 'api/discovery';
import {
  setModeExp,
  setNumberNewNotifications,
  setToken,
  updatePassport,
  updateResource,
} from 'app-redux/actions';
import useSWR from 'swr';
import I18Next from 'utility/I18Next';
import {chooseLanguageFromId} from 'utility/assistant';
import AsyncStorage from 'utility/asyncStore';

const useInitApp = () => {
  const {
    isLoading: loading,
    isValidating: validating,
    error,
    mutate,
  } = useSWR(
    'app.checkInitApp',
    async () => {
      const activeUser = await AsyncStorage.getActiveUser();
      const resource = await apiGetResource();
      updateResource(resource?.data);

      if (activeUser) {
        const passport = await apiGetPassport();

        updatePassport(passport.data);
        // passport must be above token to set in SocketProvider
        setNumberNewNotifications(passport?.data.numberNewNotifications);
        setToken(activeUser?.token);
        setModeExp(false);
        I18Next.changeLanguage(
          chooseLanguageFromId(passport?.data?.profile?.language),
        );
      } else {
        const savedLanguage = await AsyncStorage.getLanguageModeExp();
        I18Next.changeLanguage(savedLanguage);
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateIfStale: false,
    },
  );

  return [
    {
      loading,
      validating,
      error,
    },
    {mutate},
  ] as const;
};

export default useInitApp;
