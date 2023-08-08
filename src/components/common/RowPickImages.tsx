import {BORDER_RADIUS} from 'asset';
import {StyleImage, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {ModalActionSheet} from 'navigation/screen/modals';
import React, {memo, useCallback, useState} from 'react';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {scale} from 'react-native-size-matters';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import ImageUploader from 'utility/ImageUploader';
import {logger, seeDetailImage} from 'utility/assistant';
import {moderateScale} from 'utility/scale';

interface Props {
  numberImages: number;
  listImages: Array<string>;
  setListImages: any;
  containerStyle?: StyleProp<ViewStyle>;
}

const RowPickImages = (props: Props) => {
  const {numberImages, listImages, setListImages, containerStyle} = props;
  const theme = useTheme();

  const [width, setWidth] = useState(0);
  const elementWidth = width / numberImages;

  const checkArray = () => {
    const temp = [];
    for (let i = 0; i < numberImages; i++) {
      temp.push('');
    }
    return temp;
  };

  const onSetAgainListImages = (addingList: Array<string>) => {
    const concatList = listImages.concat(addingList);
    if (concatList.length < numberImages) {
      setListImages(concatList);
    } else {
      concatList.splice(numberImages);
      setListImages(concatList);
    }
  };

  const onOpenActionSheet = () => {
    ModalActionSheet.show({
      options: [
        {
          title: 'common.chooseFromCamera',
          onPress: async () => {
            try {
              setTimeout(async () => {
                const res = await ImageUploader.pickCamera({crop: false});
                onSetAgainListImages([res?.path]);
              }, 200);
            } catch (err) {
              logger(err);
            }
          },
        },
        {
          title: 'common.chooseFromLibrary',
          onPress: async () => {
            try {
              setTimeout(async () => {
                const res = await ImageUploader.pickMultipleLibrary({
                  maxFiles: 3,
                });
                onSetAgainListImages(res);
              }, 200);
            } catch (err) {
              logger(err);
            }
          },
        },
      ],
    });
  };

  const onDeleteImageAtIndex = useCallback(
    (index: number) => {
      const temp = [...listImages];
      temp.splice(index, 1);
      setListImages(temp);
    },
    [setListImages, listImages],
  );

  return (
    <View
      style={[$container, containerStyle]}
      onLayout={({nativeEvent}) => setWidth(nativeEvent.layout.width)}>
      {checkArray().map((item: string, index: number) => {
        let paddingLeft = scale(2);
        let paddingRight = scale(2);
        if (index === 0) {
          paddingLeft = 0;
          paddingRight = scale(4);
        } else if (index === listImages.length - 1) {
          paddingLeft = scale(4);
          paddingRight = 0;
        }

        return (
          <View
            key={index}
            style={{
              width: elementWidth,
              height: elementWidth,
              paddingLeft,
              paddingRight,
            }}>
            <View
              style={[
                $imageBoxIn,
                {
                  borderColor: theme.gray_400,
                  borderWidth: listImages[index] ? 0 : scale(0.5),
                },
              ]}>
              {listImages[index] ? (
                <StyleTouchable
                  customStyle={$touchImage}
                  onPress={() =>
                    seeDetailImage({
                      images: listImages.map(url => url),
                      initIndex: index,
                    })
                  }>
                  <StyleImage
                    source={{uri: listImages[index]}}
                    customStyle={$image}
                  />
                </StyleTouchable>
              ) : (
                <StyleTouchable onPress={onOpenActionSheet}>
                  <AntDesgin
                    name="upload"
                    style={[$iconUpload, {color: theme.black}]}
                  />
                </StyleTouchable>
              )}

              {!!listImages[index] && (
                <StyleTouchable
                  customStyle={[$buttonX, {backgroundColor: theme.white}]}
                  onPress={() => onDeleteImageAtIndex(index)}>
                  <Feather name="x" style={[$iconX, {color: theme.black}]} />
                </StyleTouchable>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $imageBoxIn: ImageStyle = {
  flex: 1,
  borderRadius: BORDER_RADIUS.f4,
  alignItems: 'center',
  justifyContent: 'center',
};
const $touchImage: ViewStyle = {
  width: '100%',
  height: '100%',
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: BORDER_RADIUS.f4,
};
const $iconUpload: TextStyle = {
  fontSize: moderateScale(20),
};
const $buttonX: ViewStyle = {
  position: 'absolute',
  top: -moderateScale(5),
  right: -moderateScale(5),
  padding: 5,
  borderRadius: 30,
};
const $iconX: TextStyle = {
  fontSize: moderateScale(10),
};

export default memo(RowPickImages);
