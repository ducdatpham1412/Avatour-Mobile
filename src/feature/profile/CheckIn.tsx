import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageCheckIn,
} from 'asset';
import {APP_EVENT, FEELING} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, horizontalPadding, verticalMargin} from 'asset/metrics';
import {
  LoadingScreen,
  ScaleSelectList,
  ScrollCropImages,
  Stars,
} from 'components';
import {StyleContainer, StyleIcon, StyleText} from 'components/base';
import {Avatar} from 'components/common';
import {emitAppEvent, useTheme} from 'hook';
import LottieView from 'lottie-react-native';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React, {memo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageSourcePropType, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {seeDetailImage} from 'utility/assistant';
import {impactMedium} from 'utility/haptic';
import {scale, verticalScale} from 'utility/scale';
import {TitleAndInput} from './components';
import {CallBackCheckIn, useCheckIn} from './hooks';

const {width} = Metrics;
const imgWidth = width * 0.6;

type ImagesProps = {
  images: string[];
};

type ReactionProps = {
  source: ImageSourcePropType;
};

const ListImages = memo(
  ({images}: ImagesProps) => {
    return (
      <View style={$image}>
        <ScrollCropImages
          images={images}
          width={imgWidth}
          height={imgWidth * ratioImageCheckIn}
          enableRemoveImage={false}
          containerStyle={$scrollCrop}
          onPressImage={(_, index) => {
            seeDetailImage({
              images,
              initIndex: index,
            });
          }}
        />
      </View>
    );
  },
  () => true,
);

const Reaction = ({source}: ReactionProps) => {
  return (
    <View style={$reaction}>
      <StyleIcon source={source} size={30} />
    </View>
  );
};

const CheckIn = ({route}: RouteParams<AppParamsList[ROOT_SCREEN.checkIn]>) => {
  const {itemNew} = route.params;
  const theme = useTheme();
  const {t} = useTranslation();

  const [{loadingCheckIn}, {checkIn, mutate}] = useCheckIn(
    'check-in',
    itemNew?.user.id,
  );

  const [stars, setStars] = useState(0);
  const [feeling, setFeeling] = useState<number | undefined>(FEELING.nice);
  const content = useRef('');

  const [disable, setDisable] = useState(true);

  const onConfirm = async () => {
    if (itemNew) {
      try {
        await checkIn({
          content: content.current,
          images: itemNew?.images,
          user_id: itemNew?.user.id,
          feeling,
          stars: stars || undefined,
        });
        await mutate();
        emitAppEvent(APP_EVENT.checkInSuccess, {
          userId: itemNew.user.id,
          joinId: itemNew.joinId,
        });
        ModalAlert.success({
          i18Content: 'profile.post.checkInSuccess',
          onClose: () => CallBackCheckIn.call(),
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    }
  };

  return (
    <>
      <StyleContainer
        headerProps={{
          title: 'profile.checkIn',
          RightComponent: (
            <Avatar source={{uri: itemNew?.user?.avatar}} size={28} />
          ),
        }}
        BottomComponent={{
          title: 'common.create',
          onPress: onConfirm,
          isLoading: loadingCheckIn,
          disable,
        }}
        scrollEnabled>
        {!!itemNew?.images.length && <ListImages images={itemNew.images} />}

        <TitleAndInput
          title="common.writeSomething"
          textInputProps={{
            placeholder: t('common.yourFeeling'),
            style: [$input, {backgroundColor: theme.background}],
            multiline: true,
            onChangeText: v => {
              content.current = v;
              if (disable !== !v) {
                setDisable(!v);
              }
            },
          }}
          containerStyle={$inputBox}
        />

        <View style={$stars}>
          <StyleText
            i18Text={
              stars ? 'profile.post.deleteRating' : 'profile.post.rating'
            }
            customStyle={[
              $titleRating,
              {
                textDecorationLine: stars ? 'underline' : 'none',
              },
            ]}
            onPress={stars ? () => setStars(0) : undefined}
          />
          <Stars
            size={45}
            value={stars}
            onChangeValue={v => {
              impactMedium();
              setStars(v);
            }}
            containerStyle={$starsBox}
          />
        </View>

        <View style={$stars}>
          <StyleText
            i18Text={
              feeling === undefined
                ? 'profile.post.feeling'
                : 'profile.post.deleteFeeling'
            }
            customStyle={[
              $titleRating,
              {
                textDecorationLine:
                  feeling === undefined ? 'none' : 'underline',
              },
            ]}
            onPress={
              feeling === undefined ? undefined : () => setFeeling(undefined)
            }
          />
          <ScaleSelectList
            data={[
              {
                icon: <Reaction source={Images.icons.nice} />,
                value: FEELING.nice,
              },
              {
                icon: <Reaction source={Images.icons.cute} />,
                value: FEELING.cute,
              },
              {
                icon: <Reaction source={Images.icons.wondering} />,
                value: FEELING.wondering,
              },
              {
                icon: <Reaction source={Images.icons.cry} />,
                value: FEELING.cry,
              },
              {
                icon: <Reaction source={Images.icons.angry} />,
                value: FEELING.angry,
              },
            ]}
            value={feeling}
            onChangeValue={v => {
              impactMedium();
              setFeeling(v);
            }}
            maxScale={2}
          />
        </View>
      </StyleContainer>

      {loadingCheckIn && (
        <LoadingScreen
          loadingCpn={
            <LottieView
              source={Images.images.creating}
              autoPlay
              loop
              style={{width: 300, height: 300}}
            />
          }
          withMessage
          textWaiting={{
            i18nText: `${t('alert.avatourHandling')}. ${t(
              'alert.waitingMinute',
            )}` as I18Normalize,
          }}
          containerStyle={{backgroundColor: theme.white}}
        />
      )}
    </>
  );
};

const $image: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginTop: verticalScale(8),
};
const $stars: ViewStyle = {
  width: '100%',
  marginTop: verticalMargin + verticalScale(12),
};
const $titleRating: TextStyle = {
  fontSize: FONT_SIZE.f3,
  alignSelf: 'flex-start',
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $starsBox: ViewStyle = {
  marginTop: verticalScale(16),
  marginLeft: scale(8),
};
const $reaction: ViewStyle = {
  paddingHorizontal: scale(8),
};
const $inputBox: ViewStyle = {
  marginTop: verticalMargin,
};
const $input: TextStyle = {
  paddingTop: verticalScale(12),
  paddingBottom: verticalScale(12),
  paddingHorizontal: horizontalPadding,
  borderRadius: BORDER_RADIUS.f2,
  height: verticalScale(80),
  borderWidth: 0,
};
const $scrollCrop: ViewStyle = {
  borderRadius: BORDER_RADIUS.f2,
};

export default CheckIn;
