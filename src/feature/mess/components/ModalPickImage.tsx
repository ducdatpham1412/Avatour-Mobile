import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {
  StyleImage,
  StyleList,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useLibrary, useSafeArea} from 'hook';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  FlatList,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {moderateScale} from 'utility/scale';

interface Props {
  images: LibraryImage[];
  onChooseImage(url: LibraryImage): void;
  containerStyle?: StyleProp<ViewStyle>;
  numberColumns?: number;
  initIndexImage?: number;
  showContent?: boolean;
  urlFocusing?: string;
}

interface Refs {
  scrollToTop: () => void;
}

interface RenderImageParams {
  item: LibraryImage;
  images: LibraryImage[];
  onChooseImage(image: LibraryImage): void;
  numberColumns: number;
  isFocusing: boolean;
}

const renderImage = (params: RenderImageParams) => {
  const {item, images, onChooseImage, numberColumns, isFocusing} = params;
  const isChosen = !!images.find(img => img.url === item.url);
  const index = isChosen ? images.indexOf(item) + 1 : 0;
  const size = Metrics.width / numberColumns;

  return (
    <StyleTouchable
      onPress={() => onChooseImage(item)}
      customStyle={[$imageBox, {width: size, height: size}]}>
      <StyleImage
        source={{uri: item.url}}
        style={$image}
        defaultSource={Images.images.defaultImage}
      />

      {isChosen && (
        <>
          {isFocusing && <View style={$chosen} />}
          <View
            style={[
              $indexBox,
              {
                backgroundColor: isFocusing
                  ? Theme.newTheme.red
                  : Theme.newTheme.white,
              },
            ]}>
            <StyleText
              originValue={index}
              customStyle={[
                $textIndex,
                {color: isFocusing ? Theme.common.white : Theme.common.black},
              ]}
            />
          </View>
        </>
      )}
    </StyleTouchable>
  );
};

const ModalPickImage = (props: Props, ref: ForwardedRef<Refs>) => {
  const {
    images,
    onChooseImage,
    containerStyle,
    numberColumns = 4,
    initIndexImage = 0,
    urlFocusing,
    showContent = true,
  } = props;

  const {paddingBottom} = useSafeArea();

  const hadChoseImg = useRef(false);
  const listRef = useRef<FlatList>(null);

  const [{list, loading, validating, loadingMore}, {onRefresh, onLoadMore}] =
    useLibrary();

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () =>
        listRef.current?.scrollToOffset({offset: 0, animated: true}),
    }),
    [],
  );

  useEffect(() => {
    if (!hadChoseImg.current && list[initIndexImage]) {
      onChooseImage(list[initIndexImage]);
      hadChoseImg.current = true;
    }
  }, [list, initIndexImage]);

  return (
    <View style={[$container, containerStyle]}>
      <StyleList
        ref={listRef}
        data={list}
        renderItem={({item}) =>
          renderImage({
            item,
            images,
            onChooseImage,
            numberColumns,
            isFocusing: urlFocusing === item.url,
          })
        }
        numColumns={numberColumns}
        contentContainerStyle={{paddingBottom}}
        initLoading={loading || !showContent}
        refreshing={validating}
        onRefresh={onRefresh}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
        ListEmptyComponent={null}
        maxToRenderPerBatch={40}
      />
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: Metrics.height / 2,
};
const $imageBox: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  padding: moderateScale(0.5),
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
};
const $indexBox: ViewStyle = {
  position: 'absolute',
  top: moderateScale(5),
  right: moderateScale(5),
  width: moderateScale(20),
  height: moderateScale(20),
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: moderateScale(0.5),
  borderColor: Theme.newTheme.white,
  borderRadius: 20,
};
const $textIndex: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $chosen: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: Theme.newTheme.black_opacity(0.4),
};

export default forwardRef(ModalPickImage);
