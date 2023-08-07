import ImageEditor from '@react-native-community/image-editor';
import {useIsFocused} from '@react-navigation/native';
import {Metrics} from 'asset/metrics';
import {
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  MAX_NUMBER_IMAGES_POST,
  ratioImageSale,
} from 'asset/standardValue';
import StyleTabView from 'components/StyleTabView';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import ModalPickImage from 'feature/mess/components/ModalPickImage';
import {useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ICropperParams} from 'react-native-image-zoom-and-crop';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import ImageUploader from 'utility/ImageUploader';
import {borderWidthTiny, logger} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import ScrollCropImages from './components/ScrollCropImages';

interface Props {
  route: {
    params: AppParamsList[PROFILE_ROUTE.createPostPickImg];
  };
}

const {width, height} = Metrics;
const containerPreviewImage = {
  width,
  height: width / height > 0.6 ? width * 0.6 : width,
};

const CreatePostPickImage = ({route}: Props) => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const {top} = useSafeAreaInsets();
  const isCreateSale = route.params?.mode === 'sale';

  const tabPickRef = useRef<StyleTabView>(null);

  const [images, setImages] = useState<LibraryImage[]>([]);
  const [imageFocusing, setImageFocusing] = useState('');
  const [renderingBase64, setRenderingBase64] = useState(false);
  const [video, setVideo] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [indexImageFocus, setIndexImageFocus] = useState(0);
  const [cropSize, setCropSize] = useState({
    width,
    height: width * ratioImageSale,
  });
  const [cropperParams, setCropperParams] = useState<
    Array<{url: string; value: ICropperParams | null}>
  >([]);

  const onChooseImage = (img: LibraryImage) => {
    const findIndex = images.findIndex(item => item.url === img.url);
    const included = findIndex >= 0;

    if (images.length === MAX_NUMBER_IMAGES_POST && !included) {
      return;
    }

    if (included) {
      if (imageFocusing === img.url) {
        if (images.length === 1) {
          return;
        }
        const chosenIndex = findIndex === 0 ? findIndex + 1 : findIndex - 1;
        setImageFocusing(images[chosenIndex].url);
        setImages(images.filter(item => item.url !== img.url));
        setCropperParams(cropperParams.filter(item => item.url !== img.url));
        setIndexImageFocus(chosenIndex);
      } else {
        setImageFocusing(img.url);
        setIndexImageFocus(findIndex);
      }
    } else {
      const lastIndex = images.length;
      setImageFocusing(img.url);
      setImages(images.concat(img));
      setCropperParams(cropperParams.concat({url: img.url, value: null}));
      setIndexImageFocus(lastIndex);
    }
  };

  const onChooseFromCamera = async () => {
    if (tabIndex === 1) {
      tabPickRef.current?.navigateToIndex(0);
    }

    try {
      const image = await ImageUploader.pickCamera({
        maxWidth: width,
        maxHeight: width * ratioImageSale,
      });
      const newListImages = images.concat({
        url: image.sourceURL ?? image.path,
        width: image.width,
        height: image.height,
      });
      setImages(newListImages);
      setIndexImageFocus(newListImages.length - 1);
    } catch (err) {
      logger(err);
    }
  };

  const onChooseVideo = async () => {
    if (tabIndex === 0) {
      if (!video) {
        try {
          const res = await ImageUploader.pickVideo();
          tabPickRef.current?.navigateToIndex(1);
          setVideo(res);
        } catch (err) {
          logger(err);
        }
      } else {
        tabPickRef.current?.navigateToIndex(1);
      }
    } else {
      try {
        const res = await ImageUploader.pickVideo();
        setVideo(res);
      } catch (err) {
        logger(err);
      }
    }
  };

  const onNavigatePreview = async () => {
    try {
      setRenderingBase64(true);
      const results = await Promise.all(
        images.map(async img => {
          // const cropperCheck = cropperParams.find(item => item.url === url);
          // if (cropperCheck?.value) {
          //   const temp = await ImageZoomAndCrop.crop({
          //     ...cropperCheck.value,
          //     imageUri: url,
          //     cropSize,
          //     cropAreaSize: cropSize,
          //   });
          //   return temp ?? '';
          // }

          // const croppedUrl = await ImageZoomAndCrop.crop({
          //   cropSize: {
          //     width: img.width,
          //     height: img.height,
          //   },
          //   cropAreaSize: {
          //     width: img.width,
          //     height: img.height,
          //   },
          //   imageUri: img.url,
          //   positionX: 0,
          //   positionY: 0,
          //   scale: 1,
          //   srcSize: {
          //     width: img.width,
          //     height: img.height,
          //   },
          //   fittedSize: {
          //     width: 100,
          //     height: 70,
          //   },
          // }).catch(err => {
          //   console.log('crop error: ', err);
          // });

          const croppedUrl = await ImageEditor.cropImage(img.url, {
            offset: {
              x: 0,
              y: 0,
            },
            size: {
              width: img.width,
              height: img.height,
            },
          });
          return croppedUrl;
        }),
      );

      if (results.length) {
        if (isCreateSale) {
          navigate(PROFILE_ROUTE.createSale, {
            itemNew: {
              images: tabIndex === 0 ? results : [video],
              isVideo: tabIndex === 1,
            },
          });
        } else {
          navigate(PROFILE_ROUTE.createPostPreview, {
            itemNew: {
              images: tabIndex === 0 ? results : [video],
              isVideo: tabIndex === 1,
              userReviewed: route.params?.userReviewed,
            },
          });
        }
      }
    } catch (err) {
      logger('Error render base64: ', err);
    } finally {
      setRenderingBase64(false);
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
      return (
        <Video
          key={video}
          source={{
            uri: video,
          }}
          style={$video}
          repeat
          controls
          muted={!isFocused}
          paused={!isFocused}
        />
      );
    }

    if (isCreateSale) {
      return (
        <ScrollCropImages
          images={images.map(item => item.url)}
          imageFocusing={imageFocusing}
          index={indexImageFocus}
          width={width}
          height={width * ratioImageSale}
          onChangeCropperParams={value => {
            setCropperParams(preValue =>
              preValue.map(item => {
                if (item.url !== value.url) {
                  return item;
                }
                return value;
              }),
            );
          }}
          initRatio={isCreateSale ? ratioImageSale : 1}
          onChangeCropperSize={value => setCropSize(value)}
          havingZoomButton={!isCreateSale}
          onRemoveImage={url => {
            const findImage = images.find(item => item.url === url);
            if (findImage) {
              onChooseImage(findImage);
            }
          }}
        />
      );
    }

    return (
      <View
        style={{
          width: containerPreviewImage.width,
          height: containerPreviewImage.height,
          alignItems: 'center',
        }}>
        <StyleImage
          source={{uri: images[0].url}}
          customStyle={$imageBehind}
          blurRadius={10}
        />
        <ScrollCropImages
          images={images.map(item => item.url)}
          imageFocusing={imageFocusing}
          index={indexImageFocus}
          width={containerPreviewImage.height}
          height={containerPreviewImage.height}
          onChangeCropperParams={value => {
            setCropperParams(preValue =>
              preValue.map(item => {
                if (item.url !== value.url) {
                  return item;
                }
                return value;
              }),
            );
          }}
          initRatio={isCreateSale ? ratioImageSale : 1}
          onChangeCropperSize={value => setCropSize(value)}
          havingZoomButton={!isCreateSale}
          onRemoveImage={url => {
            const findImage = images.find(item => item.url === url);
            if (findImage) {
              onChooseImage(findImage);
            }
          }}
        />
      </View>
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
          onPress={() => tabPickRef.current?.navigateToIndex(0)}
          hitSlop={15}>
          <FontAwesome
            name="image"
            style={[
              $iconImage,
              {
                color: theme.black,
              },
            ]}
          />
        </StyleTouchable>
        <StyleTouchable
          customStyle={$touchCamera}
          onPress={onChooseFromCamera}
          hitSlop={15}>
          <Ionicons
            name="camera-outline"
            style={[
              $iconCamera,
              {
                color: theme.black,
              },
            ]}
          />
        </StyleTouchable>

        {tabIndex === 0 && (
          <StyleText
            originValue={`${images.length}`}
            customStyle={[$textIndex, {color: theme.black}]}
          />
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
        {renderingBase64 ? (
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
          images={images}
          onChooseImage={onChooseImage}
          numberColumns={4}
          containerStyle={$modalPickImage}
          initIndexImage={0}
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
const $video: ViewStyle = {
  width,
  minHeight: width,
  maxHeight: '80%',
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
  fontSize: moderateScale(13),
};
const $imageBehind: ImageStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};
const $touchCamera: ViewStyle = {
  position: 'absolute',
  left: scale(60),
};
const $iconCamera: TextStyle = {
  fontSize: moderateScale(16.5),
};
const $textIndex: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $tabView: ViewStyle = {
  flex: 1,
};
const $modalPickImage: ViewStyle = {
  height: undefined,
  flex: 1,
};

export default CreatePostPickImage;
