import {apiChangeLanguage} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {LANGUAGE_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage} from 'components/base';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ScaledSheet} from 'react-native-size-matters';
import {useUpdateEffect} from 'react-use';
import {chooseLanguageFromId} from 'utility/assistant';
import AppAsyncStorage from 'utility/asyncStore';
import I18Next from 'utility/I18Next';
import {verticalScale} from 'utility/scale';

interface Props {
  isOpening: boolean;
}

const LanguageSetting = ({isOpening}: Props) => {
  const theme = useTheme();
  const {
    modeExp,
    passport: {
      profile: {language},
    },
  } = useAppSelector(state => state.accountSlice);

  const aim = useSharedValue(0);
  const heightStyle = useAnimatedStyle(() => ({
    height: aim.value,
  }));

  const [isPicked, setIsPicked] = useState(language);

  useUpdateEffect(() => {
    aim.value = withTiming(isOpening ? containerHeight : 0, {duration: 300});
  }, [isOpening]);

  const selectBorderColor = (lan: number) =>
    isPicked === lan ? theme.highlightColor : theme.holderColor;

  const switchLanguage = async (newLanguage: number) => {
    if (newLanguage === isPicked) {
      return;
    }

    try {
      if (!modeExp) {
        await apiChangeLanguage(newLanguage);
      }
      I18Next.changeLanguage(chooseLanguageFromId(newLanguage));
      updatePassport({profile: {language: newLanguage}});
      setIsPicked(newLanguage);
      await AppAsyncStorage.editLanguageModeExp(
        chooseLanguageFromId(newLanguage),
      );
      ModalAlert.success({
        i18Content: 'alert.successChange',
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <Animated.View style={[styles.container, heightStyle]}>
      <TouchableOpacity
        style={[
          styles.themeBox,
          {borderColor: selectBorderColor(LANGUAGE_TYPE.en)},
        ]}
        onPress={() => switchLanguage(LANGUAGE_TYPE.en)}>
        <StyleImage
          source={Images.images.english}
          customStyle={styles.themeImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.themeBox,
          {borderColor: selectBorderColor(LANGUAGE_TYPE.vi)},
        ]}
        onPress={() => switchLanguage(LANGUAGE_TYPE.vi)}>
        <StyleImage
          source={Images.images.vietnamese}
          customStyle={styles.themeImage}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const size = Metrics.width / 4;
const containerHeight = size + verticalScale(40);

const styles = ScaledSheet.create({
  container: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: containerHeight,
    overflow: 'hidden',
  },
  themeBox: {
    width: Metrics.width / 4,
    height: Metrics.width / 4,
    borderWidth: '5@vs',
    borderRadius: '20@vs',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeImage: {
    width: '100%',
    height: '100%',
  },
});

export default LanguageSetting;
