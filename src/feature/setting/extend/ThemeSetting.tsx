import {apiChangeTheme} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {THEME_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage} from 'components/base';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useState} from 'react';
import {ImageStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import {moderateScale, verticalScale} from 'utility/scale';

const ThemeSetting = () => {
  const theme = useTheme();
  const {theme: themeSetting} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const [isPicked, setIsPicked] = useState(
    themeSetting === 0 ? 'dark' : 'light',
  );

  const selectBdColor = (type: string) => {
    return isPicked === type ? theme.p_600 : theme.gray_200;
  };

  const switchTheme = async (type: string) => {
    let newTheme = 0;
    if (type === 'dark') {
      newTheme = THEME_TYPE.darkTheme;
    } else if (type === 'light') {
      newTheme = THEME_TYPE.lightTheme;
    }

    try {
      if (!modeExp) {
        await apiChangeTheme(newTheme);
      }
      updatePassport({
        profile: {
          theme: newTheme,
        },
      });
      ModalAlert.success({
        i18Content: 'alert.successChange',
      });
      setIsPicked(type);
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <View style={$container}>
      <TouchableOpacity
        style={[$theme, {borderColor: selectBdColor('dark')}]}
        onPress={() => switchTheme('dark')}>
        <StyleImage source={Images.images.darkTheme} customStyle={$img} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[$theme, {borderColor: selectBdColor('light')}]}
        onPress={() => switchTheme('light')}>
        <StyleImage source={Images.images.lightTheme} customStyle={$img} />
      </TouchableOpacity>
    </View>
  );
};

const $container: ViewStyle = {
  width: '80%',
  paddingVertical: verticalScale(20),
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignSelf: 'center',
};
const $theme: ViewStyle = {
  width: Metrics.width / 4,
  height: Metrics.width / 4,
  borderWidth: moderateScale(4),
  borderRadius: moderateScale(20),
  overflow: 'hidden',
};
const $img: ImageStyle = {
  width: '100%',
  height: '100%',
};

export default ThemeSetting;
