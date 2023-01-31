/* eslint-disable no-underscore-dangle */
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {StyleImage, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import React, {useEffect, useState} from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {isIOS} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    images: Array<string>;
    onChooseImage(image: string): void;
    containerStyle?: StyleProp<ViewStyle>;
    numberColumns?: number;
    initIndexImage?: number;
    urlFocusing?: string;
}
interface StatusLibrary {
    endCursor: string | undefined;
    hasNext: boolean;
}

interface RenderImageParams {
    item: string;
    images: Array<string>;
    onChooseImage(image: string): void;
    theme: TypeTheme;
    numberColumns: number;
    isFocusing: boolean;
}

const RenderImage = (params: RenderImageParams) => {
    const {item, images, onChooseImage, theme, numberColumns, isFocusing} =
        params;
    const isChosen = images.includes(item);
    const size = Metrics.width / numberColumns;

    return (
        <StyleTouchable
            onPress={() => onChooseImage(item)}
            customStyle={[styles.imageBox, {width: size, height: size}]}>
            <StyleImage
                source={{uri: item}}
                style={styles.image}
                defaultSource={Images.images.defaultImage}
            />

            {isChosen && (
                <>
                    <View
                        style={[
                            styles.layoutChosen,
                            {backgroundColor: Theme.common.black},
                        ]}
                    />
                    <AntDesign
                        name="check"
                        style={[
                            styles.checkIcon,
                            {
                                color: isFocusing
                                    ? Theme.common.white
                                    : theme.highlightColor,
                            },
                        ]}
                    />
                </>
            )}
        </StyleTouchable>
    );
};

const ModalPickImage = (props: Props) => {
    const theme = Redux.getTheme();
    const {
        images,
        onChooseImage,
        containerStyle,
        numberColumns = 4,
        initIndexImage,
        urlFocusing,
    } = props;

    const [libraryImages, setLibraryImages] = useState<Array<any>>([]);
    const [hadSetIndexImage, setHadSetIndexImage] = useState(false);

    const [pageIndex, setPageIndex] = useState(1);
    const [statusLibrary, setStatusLibrary] = useState<StatusLibrary>({
        endCursor: undefined,
        hasNext: true,
    });

    const [firstLoad, setFirstLoad] = useState(20);

    const getData = async () => {
        const res = await ImageUploader.readImageFromLibrary({
            first: firstLoad,
            after: statusLibrary.endCursor,
        });

        // check have next page
        const endCursor = res.page_info.end_cursor;
        const haveNextPage = res.page_info.has_next_page;
        setStatusLibrary({
            endCursor,
            hasNext: haveNextPage,
        });

        // set to state libraryImages
        const moreImages = res.edges.map(item => {
            if (isIOS) {
                return item.node.image.uri.concat(
                    `/${item.node.image.filename}`,
                );
            }
            return item.node.image.uri;
        });
        const temp = libraryImages.concat(moreImages);
        if (!hadSetIndexImage && initIndexImage !== undefined) {
            onChooseImage(temp[initIndexImage]);
            setHadSetIndexImage(true);
        }
        setLibraryImages(temp);
        setFirstLoad(80);
    };

    useEffect(() => {
        if (statusLibrary.hasNext) {
            getData();
        }
    }, [pageIndex]);

    const onLoadMoreImage = () => {
        if (statusLibrary.hasNext) {
            setPageIndex(pageIndex + 1);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <StyleList
                data={libraryImages}
                renderItem={({item}: any) =>
                    RenderImage({
                        item,
                        images,
                        onChooseImage,
                        theme,
                        numberColumns,
                        isFocusing: urlFocusing === item,
                    })
                }
                numColumns={numberColumns}
                onLoadMore={onLoadMoreImage}
                contentContainerStyle={styles.contentContainer}
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
        opacity: 0.6,
    },
    checkIcon: {
        position: 'absolute',
        fontSize: '60@ms',
    },
    contentContainer: {
        paddingBottom: Metrics.safeBottomPadding + verticalScale(10),
    },
});

export default ModalPickImage;
