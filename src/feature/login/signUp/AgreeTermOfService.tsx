import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {SafeView, StyleButton, StyleImage, StyleText} from 'components/base';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {ImageStyle, TextStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';

const AgreeTermOfService = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.agreeTermOfService]>) => {
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
        customStyle={$imageSuccess}
      />
      <StyleText
        i18Text="login.contentSuggest"
        customStyle={$contentSuggest}
        mode="html"
      />
      <StyleButton title="login.letGo" onPress={onGoToEditInformation} />
    </SafeView>
  );
};

const $imageSuccess: ImageStyle = {
  width: Metrics.width / 2.5,
  height: Metrics.width / 2.5,
};
const $contentSuggest: TextStyle = {
  marginVertical: verticalScale(32),
  textAlign: 'center',
  paddingHorizontal: scale(40),
};

export default AgreeTermOfService;
