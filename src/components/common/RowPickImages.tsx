import {StyleImage, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, View, ViewStyle} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {scale, ScaledSheet} from 'react-native-size-matters';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {
    chooseImageFromCamera,
    chooseImageFromLibrary,
    optionsImagePicker,
    seeDetailImage,
} from 'utility/assistant';

interface Props {
    numberImages: number;
    listImages: Array<string>;
    setListImages: any;
    containerStyle?: StyleProp<ViewStyle>;
}

const RowPickImages = (props: Props) => {
    const {numberImages, listImages, setListImages, containerStyle} = props;
    const {t} = useTranslation();
    const theme = Redux.getTheme();

    const actionRef = useRef<any>(null);

    const [width, setWidth] = useState(0);
    const elementWidth = width / numberImages;

    const optionsImgPicker = useMemo(() => {
        return optionsImagePicker.map(item => t(item));
    }, []);
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
    const chooseAction = useCallback(
        async (index: number) => {
            if (index === 0) {
                await chooseImageFromCamera(onSetAgainListImages, {
                    multiple: true,
                    maxFiles: numberImages - listImages.length,
                });
            } else if (index === 1) {
                await chooseImageFromLibrary(onSetAgainListImages, {
                    multiple: true,
                    maxFiles: numberImages - listImages.length,
                });
            }
        },
        [listImages, numberImages],
    );

    const onDeleteImageAtIndex = useCallback(
        (index: number) => {
            const temp = [...listImages];
            temp.splice(index, 1);
            setListImages(temp);
        },
        [listImages],
    );

    return (
        <View
            style={[styles.container, containerStyle]}
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
                                styles.imageBoxIn,
                                {
                                    borderColor: theme.borderColor,
                                    borderWidth: listImages[index]
                                        ? 0
                                        : scale(0.5),
                                },
                            ]}>
                            {/* Image */}
                            {listImages[index] ? (
                                <StyleTouchable
                                    customStyle={styles.touchImage}
                                    onPress={() =>
                                        seeDetailImage({
                                            images: listImages.map(url => url),
                                            initIndex: index,
                                        })
                                    }>
                                    <StyleImage
                                        source={{uri: listImages[index]}}
                                        customStyle={styles.image}
                                    />
                                </StyleTouchable>
                            ) : (
                                <StyleTouchable
                                    onPress={() => {
                                        actionRef.current?.show();
                                    }}>
                                    <AntDesgin
                                        name="upload"
                                        style={[
                                            styles.iconUpload,
                                            {color: theme.textColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            )}

                            {/* Button delete */}
                            {listImages[index] && (
                                <StyleTouchable
                                    customStyle={[
                                        styles.touchIconX,
                                        {backgroundColor: theme.textColor},
                                    ]}
                                    onPress={() => onDeleteImageAtIndex(index)}>
                                    <Feather
                                        name="x"
                                        style={[
                                            styles.iconX,
                                            {color: theme.backgroundColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            )}
                        </View>
                    </View>
                );
            })}

            <ActionSheet
                ref={actionRef}
                options={optionsImgPicker}
                cancelButtonIndex={2}
                onPress={chooseAction}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
    },
    imageBoxIn: {
        flex: 1,
        borderRadius: '7@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchImage: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: '7@s',
    },
    iconUpload: {
        fontSize: '20@ms',
    },
    touchIconX: {
        position: 'absolute',
        top: '-5@ms',
        right: 0,
        padding: '5@ms',
        borderRadius: '10@s',
    },
    iconX: {
        fontSize: '10@ms',
    },
});

export default memo(RowPickImages);
