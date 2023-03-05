import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {SafeView, StyleButton, StyleImage, StyleText} from 'components/base';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

const AgreeTermOfService = ({
  route,
}: AppRouteParams<AppParamsList[LOGIN_ROUTE.agreeTermOfService]>) => {
  const {itemLoginSuccess} = route.params;

  const onGoToEditInformation = async () => {
    navigate(LOGIN_ROUTE.editBasicInformation, {
      itemLoginSuccess,
    });
  };

  return (
    <SafeView center safeBottom>
      <StyleImage
        source={Images.images.successful}
        customStyle={styles.imageSuccess}
      />
      <StyleText
        i18Text="login.contentSuggest"
        customStyle={styles.contentSuggest}
      />
      <StyleButton title="login.letGo" onPress={onGoToEditInformation} />
    </SafeView>
  );
};

const styles = ScaledSheet.create({
  imageSuccess: {
    width: Metrics.width / 2.5,
    height: Metrics.width / 2.5,
  },
  contentSuggest: {
    marginVertical: '32@vs',
    fontSize: FONT_SIZE.f1,
    textAlign: 'center',
    paddingHorizontal: '40@s',
  },
});

export default AgreeTermOfService;
