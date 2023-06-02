import {useIsFocused} from '@react-navigation/native';
import {Metrics} from 'asset/metrics';
import {
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  MAX_NUMBER_IMAGES_POST,
  ratioImageGroupBuying,
} from 'asset/standardValue';
import StyleTabView from 'components/StyleTabView';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import ModalPickImage from 'feature/mess/components/ModalPickImage';
import {useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import ImageZoomAndCrop from 'react-native-image-zoom-and-crop';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import ImageUploader from 'utility/ImageUploader';
import {borderWidthTiny, logger} from 'utility/assistant';
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
  const isCreateSale = route.params?.mode === 'sale';

  const tabPickRef = useRef<StyleTabView>(null);

  const [images, setImages] = useState<Array<string>>([]);
  const [imageFocusing, setImageFocusing] = useState('');
  const [video, setVideo] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [indexScroll, setIndexScroll] = useState(0);
  const [cropSize, setCropSize] = useState({
    width: 0,
    height: 0,
  });

  const [cropperParams, setCropperParams] = useState<
    Array<{url: string; value: any}>
  >([]);

  const onChooseImage = (url: string) => {
    if (images.length === MAX_NUMBER_IMAGES_POST && !images.includes(url)) {
      return;
    }

    if (images.includes(url)) {
      const currentIndex = images.indexOf(url);
      if (imageFocusing === url) {
        if (images.length === 1) {
          return;
        }
        const chosenIndex =
          currentIndex === 0 ? currentIndex + 1 : currentIndex - 1;
        setImageFocusing(images[chosenIndex]);
        setImages(images.filter(item => item !== url));
        setCropperParams(cropperParams.filter(item => item.url !== url));
        setIndexScroll(chosenIndex);
      } else {
        setImageFocusing(url);
        setIndexScroll(currentIndex);
      }
    } else {
      const lastIndex = images.length;
      setImageFocusing(url);
      setImages(images.concat(url));
      setCropperParams(cropperParams.concat({url, value: null}));
      setIndexScroll(lastIndex);
    }
  };

  const onChooseFromCamera = async () => {
    if (tabIndex === 1) {
      tabPickRef.current?.navigateToIndex(0);
    }

    try {
      const path = await ImageUploader.pickCamera({
        maxWidth: width,
        maxHeight: width * ratioImageGroupBuying,
      });
      setImages(images.concat(path));
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
    const results = await Promise.all(
      images.map(async url => {
        const cropperCheck = cropperParams.find(item => item.url === url);
        if (cropperCheck?.value) {
          const temp = await ImageZoomAndCrop.crop({
            ...cropperCheck.value,
            imageUri: url,
            cropSize,
            cropAreaSize: cropSize,
          });
          return temp ?? '';
        }
        return url;
      }),
    );

    if (results) {
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
          style={styles.videoView}
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
          images={images}
          imageFocusing={imageFocusing}
          index={indexScroll}
          width={width}
          height={width * ratioImageGroupBuying}
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
          initRatio={isCreateSale ? ratioImageGroupBuying : 1}
          onChangeCropperSize={value => setCropSize(value)}
          havingZoomButton={!isCreateSale}
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
          source={{uri: images[0]}}
          customStyle={styles.imageBehind}
          blurRadius={10}
        />
        <ScrollCropImages
          images={images}
          imageFocusing={imageFocusing}
          index={indexScroll}
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
          initRatio={isCreateSale ? ratioImageGroupBuying : 1}
          onChangeCropperSize={value => setCropSize(value)}
          havingZoomButton={!isCreateSale}
        />
      </View>
    );
  };

  const renderTool = () => {
    return (
      <View
        style={[
          styles.toolView,
          {
            borderColor: theme.gray_300,
          },
        ]}>
        <StyleTouchable
          customStyle={styles.touchImage}
          onPress={() => tabPickRef.current?.navigateToIndex(0)}
          hitSlop={15}>
          <FontAwesome
            name="image"
            style={[
              styles.iconImage,
              {
                color: theme.black,
              },
            ]}
          />
        </StyleTouchable>
        <StyleTouchable
          customStyle={styles.touchCamera}
          onPress={onChooseFromCamera}
          hitSlop={15}>
          <Ionicons
            name="camera-outline"
            style={[
              styles.iconCamera,
              {
                color: theme.black,
              },
            ]}
          />
        </StyleTouchable>

        {tabIndex === 0 && (
          <StyleText
            originValue={`${images.length}`}
            customStyle={[styles.indexText, {color: theme.black}]}
          />
        )}

        <StyleTouchable
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
        </StyleTouchable>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.white}]}>
      <View style={[styles.headerView, {borderBottomColor: theme.gray_400}]}>
        <StyleTouchable customStyle={styles.iconCloseView} onPress={goBack}>
          <AntDesign
            name="close"
            style={[styles.iconClose, {color: theme.black}]}
          />
        </StyleTouchable>
        <StyleText
          i18Text="profile.post.pickImage"
          customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
        />
        <StyleTouchable
          customStyle={styles.nextView}
          onPress={onNavigatePreview}>
          <StyleText
            i18Text="common.next"
            customStyle={[styles.textNext, {color: theme.p_800}]}
          />
        </StyleTouchable>
      </View>
      {renderImages()}
      {renderTool()}
      <StyleTabView
        ref={tabPickRef}
        containerStyle={styles.tabView}
        onChangeTabIndex={index => {
          setTabIndex(index);
        }}
        enableScroll={false}>
        <ModalPickImage
          images={images}
          onChooseImage={onChooseImage}
          numberColumns={4}
          containerStyle={styles.modalPickImageView}
          initIndexImage={0}
          urlFocusing={imageFocusing}
        />
        <View />
      </StyleTabView>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.safeTopPadding,
  },
  // header
  headerView: {
    width: '100%',
    paddingVertical: '10@vs',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: borderWidthTiny,
  },
  iconCloseView: {
    position: 'absolute',
    left: '20@s',
  },
  iconClose: {
    fontSize: '25@ms',
  },
  nextView: {
    position: 'absolute',
    right: '20@s',
  },
  textNext: {
    fontSize: FONT_SIZE.f1,
    fontWeight: 'bold',
  },
  // image preview
  videoView: {
    width,
    minHeight: width,
    maxHeight: '80%',
  },
  // tool
  toolView: {
    width: '100%',
    height: '35@ms',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: borderWidthTiny,
    borderBottomWidth: borderWidthTiny,
  },
  touchImage: {
    position: 'absolute',
    left: '20@s',
  },
  iconImage: {
    fontSize: '13@ms',
  },
  touchCamera: {
    position: 'absolute',
    left: '60@s',
  },
  iconCamera: {
    fontSize: '16.5@ms',
  },
  videoTouch: {
    position: 'absolute',
    right: '10@s',
    width: '25@ms',
    height: '25@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidthTiny,
    borderRadius: 20,
  },
  spaceBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.9,
  },
  iconVideo: {
    fontSize: '14@ms',
  },
  indexText: {
    fontSize: FONT_SIZE.f3,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  // modal pick image view
  tabView: {
    flex: 1,
  },
  modalPickImageView: {
    height: undefined,
    flex: 1,
  },
  imageBehind: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default CreatePostPickImage;
