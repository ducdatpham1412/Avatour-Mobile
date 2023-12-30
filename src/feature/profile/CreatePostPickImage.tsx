import ImageEditor from '@react-native-community/image-editor';
import {Metrics} from 'asset/metrics';
import {
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset/standardValue';
import {ScrollCropImages} from 'components';
import StyleTabView from 'components/StyleTabView';
import {StyleText, StyleTouchable} from 'components/base';
import ModalPickImage from 'feature/mess/components/ModalPickImage';
import {useLoading, useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {ToolTip} from 'navigation/screen/modals';
import React, {ElementRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageUploader from 'utility/ImageUploader';
import {borderWidthTiny, logger} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  route: {
    params: AppParamsList[PROFILE_ROUTE.createPostPickImg];
  };
}

const {width} = Metrics;

const CreatePostPickImage = ({route}: Props) => {
  const isCreateSale = route.params?.mode === 'sale';
  const theme = useTheme();
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation();

  const {loading, setLoading} = useLoading();

  const tabPickRef = useRef<StyleTabView>(null);
  const modalPickImgRef = useRef<ElementRef<typeof ModalPickImage>>(null);
  const cropperParams = useRef<Array<{url: string; value: ZoomImageParams}>>(
    [],
  );
  const maxNumberImages = useRef(10);

  const [images, setImages] = useState<LibraryImage[]>([]);
  const [imageFocusing, setImageFocusing] = useState('');
  const [video] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [indexImageFocus, setIndexImageFocus] = useState(0);

  const onChooseImage = (img: LibraryImage) => {
    const findIndex = images.findIndex(item => item.url === img.url);
    const included = findIndex >= 0;

    if (images.length === maxNumberImages.current && !included) {
      return;
    }

    if (included) {
      if (imageFocusing === img.url) {
        if (images.length === 1) {
          return;
        }
        const chosenIndex = findIndex === 0 ? findIndex + 1 : findIndex - 1;
        setImageFocusing(images[chosenIndex].url);
        setImages(images.filter(item => item !== img));
        setIndexImageFocus(chosenIndex);
        cropperParams.current = cropperParams.current.filter(
          item => item.url !== img.url,
        );
      } else {
        setImageFocusing(img.url);
        setIndexImageFocus(findIndex);
      }
    } else {
      const lastIndex = images.length;
      setImageFocusing(img.url);
      setImages(images.concat(img));
      setIndexImageFocus(lastIndex);
    }
  };

  const onChooseFromCamera = async () => {
    if (tabIndex === 1) {
      tabPickRef.current?.navigateToIndex(0);
    }

    if (images.length >= 10) {
      ToolTip.show({
        content: t('alert.onlyChooseMaxImage'),
        button: {
          title: 'common.ok',
          onPress: () => ToolTip.hide(),
        },
      });
      return;
    }

    try {
      const image = await ImageUploader.pickCamera({
        maxWidth: width,
        maxHeight: width * ratioImageSale,
      });
      const newListImages = images.concat({
        url: image.path ?? image.sourceURL,
        width: image.width,
        height: image.height,
      });
      setImages(newListImages);
      setIndexImageFocus(newListImages.length - 1);
    } catch (err) {
      logger(err);
    }
  };

  const onNavigatePreview = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled(
        images.map(async img => {
          const cropperValue = cropperParams.current.find(
            c => c.url === img.url,
          );

          if (!cropperValue) {
            throw new Error('Not found image');
          }

          const imageHeight = (img.height / img.width) * width;
          const scaleWidth = width * cropperValue.value.scale;
          const scaleHeight = imageHeight * cropperValue.value.scale;

          const centerPos = {
            translateX: cropperValue.value.translateX + width / 2,
            translateY: cropperValue.value.translateY + imageHeight / 2,
          };
          const tsXScale = centerPos.translateX - scaleWidth / 2;
          const tsYScale = centerPos.translateY - scaleHeight / 2;

          const ratioRealImgWithScaleImg = img.width / scaleWidth;

          const offset = {
            x: -tsXScale * ratioRealImgWithScaleImg,
            y: -tsYScale * ratioRealImgWithScaleImg,
          };

          const size = {
            width: width * ratioRealImgWithScaleImg,
            height: width * ratioImageSale * ratioRealImgWithScaleImg,
          };

          const croppedUrl = await ImageEditor.cropImage(img.url, {
            offset: offset,
            size,
            resizeMode: 'contain',
          });
          return croppedUrl;
        }),
      );

      const listImages =
        tabIndex === 0
          ? results
              .filter(r => r.status === 'fulfilled')
              .map(r => (r as PromiseFulfilledResult<string>).value)
          : [video];

      if (results.length) {
        if (isCreateSale) {
          navigate(PROFILE_ROUTE.createSale, {
            itemNew: {
              images: listImages,
              isVideo: tabIndex === 1,
            },
          });
        } else {
          navigate(PROFILE_ROUTE.createPostPreview, {
            itemNew: {
              images: listImages,
              isVideo: tabIndex === 1,
              userReviewed: route.params?.userReviewed,
            },
          });
        }
      }
    } catch (err) {
      logger('Error render base64: ', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render views
   */
  const renderImages = () => {
    if (tabIndex === 1) {
      if (!video) {
        return null;
      }
      //   return (
      //     <Video
      //       key={video}
      //       source={{
      //         uri: video,
      //       }}
      //       style={$video}
      //       repeat
      //       controls
      //       muted={!isFocused}
      //       paused={!isFocused}
      //     />
      //   );
      return null;
    }

    return (
      <ScrollCropImages
        images={images.map(item => item.url)}
        index={indexImageFocus}
        width={width}
        height={width * ratioImageSale}
        zoomEnable
        onChangeCropperParams={value => {
          const check = cropperParams.current.find(
            item => item.url === value.url,
          );

          if (check) {
            cropperParams.current = cropperParams.current.map(item => {
              if (item.url !== value.url) {
                return item;
              }
              return value;
            });
          } else {
            cropperParams.current = cropperParams.current.concat(value);
          }
        }}
        onRemoveImage={url => {
          const findImage = images.find(item => item.url === url);
          if (findImage) {
            onChooseImage(findImage);
          }
        }}
      />
    );
  };

  const renderTool = () => {
    return (
      <View
        style={[
          $toolView,
          {
            borderColor: theme.gray_300,
          },
        ]}>
        <StyleTouchable
          customStyle={$touchImage}
          onPress={() => modalPickImgRef.current?.scrollToTop()}
          hitSlop={15}>
          <Entypo
            name="images"
            style={[
              $iconImage,
              {
                color: theme.gray_800,
              },
            ]}
          />
        </StyleTouchable>
        <StyleTouchable
          customStyle={$touchCamera}
          onPress={onChooseFromCamera}
          hitSlop={15}>
          <FontAwesome
            name="camera"
            style={[
              $iconCamera,
              {
                color: theme.gray_800,
              },
            ]}
          />
        </StyleTouchable>

        {tabIndex === 0 && (
          <View style={$index}>
            <StyleTouchable
              onPress={() => {
                if (indexImageFocus > 0) {
                  setIndexImageFocus(pre => pre - 1);
                }
              }}>
              <AntDesign
                name="arrowleft"
                style={[$iconDirection, {color: theme.black}]}
              />
            </StyleTouchable>
            <StyleText
              originValue={`${images.length}/${maxNumberImages.current}`}
              customStyle={[$textIndex, {color: theme.black}]}
            />
            <StyleTouchable
              onPress={() => {
                if (indexImageFocus < images.length - 1) {
                  setIndexImageFocus(pre => pre + 1);
                }
              }}>
              <AntDesign
                name="arrowright"
                style={[$iconDirection, {color: theme.black}]}
              />
            </StyleTouchable>
          </View>
        )}

        {/* <StyleTouchable
          customStyle={[
            styles.videoTouch,
            {
              borderColor: theme.gray_400,
              backgroundColor: theme.black_opacity(0.08),
            },
          ]}
          onPress={onChooseVideo}>
          <Ionicons
            name="ios-videocam-outline"
            style={[styles.iconVideo, {color: theme.black}]}
          />
        </StyleTouchable> */}
      </View>
    );
  };

  return (
    <View style={[$container, {backgroundColor: theme.white, paddingTop: top}]}>
      <View style={[$headerView, {borderBottomColor: theme.gray_400}]}>
        <StyleTouchable customStyle={$iconCloseView} onPress={goBack}>
          <AntDesign name="close" style={[$iconClose, {color: theme.black}]} />
        </StyleTouchable>
        <StyleText
          i18Text="profile.post.pickImage"
          customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
        />
        {loading ? (
          <ActivityIndicator
            color={theme.p_800}
            size="small"
            style={$nextView}
          />
        ) : (
          <StyleTouchable customStyle={$nextView} onPress={onNavigatePreview}>
            <StyleText
              i18Text="common.next"
              customStyle={[$textNext, {color: theme.p_800}]}
            />
          </StyleTouchable>
        )}
      </View>

      {renderImages()}
      {renderTool()}

      <StyleTabView
        ref={tabPickRef}
        containerStyle={$tabView}
        onChangeTabIndex={index => {
          setTabIndex(index);
        }}
        enableScroll={false}>
        <ModalPickImage
          ref={modalPickImgRef}
          images={images}
          onChooseImage={onChooseImage}
          numberColumns={4}
          containerStyle={$modalPickImage}
          urlFocusing={imageFocusing}
        />
        <View />
      </StyleTabView>
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $headerView: ViewStyle = {
  width: '100%',
  paddingVertical: verticalScale(10),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomWidth: borderWidthTiny,
};
const $iconCloseView: ViewStyle = {
  position: 'absolute',
  left: scale(20),
};
const $iconClose: TextStyle = {
  fontSize: moderateScale(25),
};
const $nextView: ViewStyle = {
  position: 'absolute',
  right: scale(20),
};
const $textNext: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
};
const $toolView: ViewStyle = {
  width: '100%',
  height: moderateScale(35),
  alignItems: 'center',
  justifyContent: 'center',
  borderTopWidth: borderWidthTiny,
  borderBottomWidth: borderWidthTiny,
};
const $touchImage: ViewStyle = {
  position: 'absolute',
  left: scale(20),
};
const $iconImage: TextStyle = {
  fontSize: moderateScale(16.5),
};
const $touchCamera: ViewStyle = {
  position: 'absolute',
  right: scale(20),
};
const $iconCamera: TextStyle = {
  fontSize: moderateScale(16.5),
};
const $tabView: ViewStyle = {
  flex: 1,
};
const $modalPickImage: ViewStyle = {
  height: undefined,
  flex: 1,
};
const $index: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: scale(20),
};
const $textIndex: TextStyle = {
  fontSize: FONT_SIZE.f2,
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $iconDirection: TextStyle = {
  fontSize: moderateScale(19),
};

export default CreatePostPickImage;
