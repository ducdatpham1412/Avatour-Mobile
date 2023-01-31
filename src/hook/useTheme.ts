import {useAppSelector} from 'app-redux/store';
import {THEME_TYPE} from 'asset/enum';
import Theme from 'asset/theme/Theme';

const useTheme = () => {
  const check = useAppSelector(
    state => state.accountSlice.passport.setting.theme,
  );
  return check === THEME_TYPE.darkTheme ? Theme.darkTheme : Theme.lightTheme;
};

export default useTheme;
