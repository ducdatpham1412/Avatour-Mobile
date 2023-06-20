import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {isIOS, logger} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';
import {moderateScale} from 'utility/scale';

type StatusLibrary = {
  endCursor: string | undefined;
  hasNext: boolean;
};

interface Props {
  images: LibraryImage[];
  onChooseImage(image: LibraryImage): void;
  containerStyle?: StyleProp<ViewStyle>;
  numberColumns?: number;
  initIndexImage?: number;
  urlFocusing?: string;
}

interface RenderImageParams {
  item: LibraryImage;
  images: LibraryImage[];
  onChooseImage(image: LibraryImage): void;
  numberColumns: number;
  isFocusing: boolean;
}

const firstLoad = 40;

const renderImage = (params: RenderImageParams) => {
  const {item, images, onChooseImage, numberColumns, isFocusing} = params;
  const isChosen = !!images.find(img => img.url === item.url);
  const index = isChosen ? images.indexOf(item) + 1 : 0;
  const size = Metrics.width / numberColumns;

  return (
    <StyleTouchable
      onPress={() => onChooseImage(item)}
      customStyle={[styles.imageBox, {width: size, height: size}]}>
      <StyleImage
        source={{uri: item.url}}
        style={styles.image}
        defaultSource={Images.images.defaultImage}
      />

      {isChosen && (
        <>
          {isFocusing && <View style={styles.layoutChosen} />}
          <View
            style={[
              $indexBox,
              {
                backgroundColor: isFocusing
                  ? Theme.newTheme.red
                  : Theme.newTheme.blue,
              },
            ]}>
            <StyleText originValue={index} customStyle={$textIndex} />
          </View>
        </>
      )}
    </StyleTouchable>
  );
};

const defaultStatusLibrary: StatusLibrary = {
  endCursor: undefined,
  hasNext: true,
};

const ModalPickImage = (props: Props) => {
  const {
    images,
    onChooseImage,
    containerStyle,
    numberColumns = 4,
    initIndexImage,
    urlFocusing,
  } = props;

  const loading = useRef(false);

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [libraryImages, setLibraryImages] = useState<Array<LibraryImage>>([]);
  const [hadSetIndexImage, setHadSetIndexImage] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const statusLibrary = useRef<StatusLibrary>(defaultStatusLibrary);

  const getData = useCallback(async () => {
    if (loading.current) {
      return;
    }

    try {
      loading.current = true;
      const res = await ImageUploader.readImageFromLibrary({
        first: firstLoad,
        after: statusLibrary.current.endCursor,
      });

      // check have next page
      const endCursor = res.page_info.end_cursor;
      const haveNextPage = res.page_info.has_next_page;
      statusLibrary.current = {
        endCursor,
        hasNext: haveNextPage,
      };

      // set to state libraryImages
      const moreImages: LibraryImage[] = res.edges.map(item => {
        const url = isIOS
          ? item.node.image.uri.concat(`/${item.node.image.filename}`)
          : item.node.image.uri;
        return {
          url,
          width: item.node.image.width,
          height: item.node.image.height,
        };
      });
      const temp = libraryImages.concat(moreImages);
      if (!hadSetIndexImage && initIndexImage !== undefined) {
        onChooseImage(temp[initIndexImage]);
        setHadSetIndexImage(true);
      }
      setLibraryImages(temp);
    } catch (err) {
      logger('Loading image from library error: ', err);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
      loading.current = false;
    }
  }, [pageIndex]);

  useEffect(() => {
    if (statusLibrary.current.hasNext) {
      getData();
    }
  }, [pageIndex]);

  const onLoadMore = () => {
    if (statusLibrary.current.hasNext) {
      setLoadingMore(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const onRefresh = () => {
    statusLibrary.current = defaultStatusLibrary;
    setRefreshing(true);
    setPageIndex(1);
    getData();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <StyleList
        data={libraryImages}
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
        contentContainerStyle={styles.contentContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
        ListEmptyComponent={null}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: Metrics.height / 2,
  },
  imageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.select({
      ios: '0.25@ms',
      android: '0.25@ms',
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  layoutChosen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Theme.newTheme.black_opacity(0.4),
  },
  contentContainer: {
    paddingBottom: Metrics.safeBottomPadding + verticalScale(10),
  },
});

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
  color: Theme.newTheme.white,
  fontSize: FONT_SIZE.f3,
};

export default ModalPickImage;
