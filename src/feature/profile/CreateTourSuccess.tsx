import {apiEditTour} from 'api/discovery';
import {FONT_SIZE} from 'asset';
import {STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleButton, StyleIcon, StyleText} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config';
import {ModalAlert, ModalCongratulation} from 'navigation/screen/modals';
import React, {ElementRef, useEffect, useRef} from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {moderateScale, scale, verticalScale} from 'utility/scale';

const CreateTourSuccess = ({
  route: {
    params: {data},
  },
}: RouteParams<AppParamsList[PROFILE_ROUTE.createTourSuccess]>) => {
  const theme = useTheme();
  const {loading, setLoading} = useLoading();
  const modalCongratulation =
    useRef<ElementRef<typeof ModalCongratulation>>(null);
  const isTourActive = data.status === 'active';

  useEffect(() => {
    modalCongratulation.current?.show();
  }, []);

  const onPublicTour = async () => {
    try {
      setLoading(true);
      await apiEditTour(data.tour_id, {
        status: STATUS.active,
      });
      ModalAlert.success({
        title: 'discovery.thankyou',
        i18Content: 'discovery.suggestHaveBeenAcknowledged',
        icon: <StyleIcon source={Images.icons.nice} size={80} />,
        onClose: () => {
          navigate(MAIN_SCREEN.orderRoute);
        },
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={$container}>
      <StyleIcon source={Images.icons.nice} size={70} customStyle={$icon} />

      <StyleText
        i18Text="profile.createTourSuccess"
        customStyle={$textSuccess}
      />
      {isTourActive ? (
        <StyleText
          i18Text="profile.wantToShareTour"
          customStyle={$textExplain}
        />
      ) : (
        <StyleText
          i18Text="profile.havingNotVerifiedLocation"
          customStyle={$textExplain}
        />
      )}

      <View style={$button}>
        <StyleButton
          containerStyle={[
            isTourActive ? $buttonCancel : $buttonCancelDraft,
            {borderColor: theme.black},
          ]}
          titleStyle={{color: theme.black}}
          title="tour.myTours"
          onPress={() => navigate(MAIN_SCREEN.orderRoute)}
        />
        {isTourActive && (
          <>
            <View style={{width: scale(8)}} />
            <StyleButton
              containerStyle={$buttonPublic}
              title="discovery.share"
              onPress={onPublicTour}
              isLoading={loading}
            />
          </>
        )}
      </View>

      <ModalCongratulation ref={modalCongratulation} />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: scale(20),
};
const $textSuccess: TextStyle = {
  fontSize: FONT_SIZE.h1,
  fontWeight: 'bold',
  marginTop: verticalScale(20),
};
const $icon: ImageStyle = {
  alignSelf: 'center',
};
const $textExplain: TextStyle = {
  marginTop: verticalScale(8),
};
const $button: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalScale(60),
};
const $buttonCancelDraft: ViewStyle = {
  width: '100%',
  borderWidth: moderateScale(0.5),
  backgroundColor: 'transparent',
};
const $buttonCancel: ViewStyle = {
  width: undefined,
  paddingHorizontal: scale(16),
  borderWidth: moderateScale(0.5),
  backgroundColor: 'transparent',
};
const $buttonPublic: ViewStyle = {
  flex: 1,
  padding: 0,
};

export default CreateTourSuccess;
