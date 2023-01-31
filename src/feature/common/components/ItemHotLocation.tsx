import {TypeHotLocation} from 'app-redux/account/logicSlice';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleVideo from 'components/base/StyleVideo';
import Redux from 'hook/useRedux';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useState} from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {checkIsVideo} from 'utility/validate';

interface Props {
    item: TypeHotLocation;
    syncWidth: number;
    containerStyle?: StyleProp<ViewStyle>;
}

const ItemHotLocation = (props: Props) => {
    const {item, syncWidth, containerStyle} = props;
    const theme = Redux.getTheme();

    const [images, setImages] = useState<Array<string>>([]);

    useEffect(() => {
        const temp = [...item.images];
        while (temp.length < 4) {
            temp.push('');
        }
        setImages(temp);
    }, []);

    return (
        <StyleTouchable
            style={[
                styles.container,
                containerStyle,
                {
                    width: syncWidth,
                    borderColor: theme.holderColor,
                },
            ]}
            onPress={() =>
                navigate(DISCOVERY_ROUTE.searchScreen, {
                    search: item.location,
                })
            }>
            <View
                style={[
                    styles.imageView,
                    {
                        width: syncWidth,
                        height: syncWidth,
                    },
                ]}>
                {images.map((url, index) => {
                    const isVideo = checkIsVideo(url);

                    return (
                        <View key={index} style={styles.imageBox}>
                            {isVideo ? (
                                <StyleVideo
                                    source={{uri: url}}
                                    style={styles.image}
                                    isOverlay
                                    onPressOverlay={() => {
                                        navigate(DISCOVERY_ROUTE.searchScreen, {
                                            search: item.location,
                                        });
                                    }}
                                    paused
                                    currentTime={2}
                                />
                            ) : (
                                <StyleImage
                                    source={{uri: url}}
                                    customStyle={styles.image}
                                    defaultSource={Images.images.defaultImage}
                                />
                            )}

                            {index === 3 && item.total_posts > 4 && (
                                <View style={styles.totalPostsBox}>
                                    <StyleText
                                        originValue={`+${item.total_posts}`}
                                        customStyle={styles.textTotalPosts}
                                    />
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
            <View style={styles.contentView}>
                <AntDesign
                    name="search1"
                    style={[styles.iconSearch, {color: theme.borderColor}]}
                />
                <StyleText
                    originValue={item.location}
                    customStyle={[
                        styles.textLocation,
                        {color: theme.textHightLight},
                    ]}
                />
            </View>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderRadius: '5@ms',
    },
    imageView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopLeftRadius: '5@ms',
        borderTopRightRadius: '5@ms',
        overflow: 'hidden',
    },
    imageBox: {
        width: '50%',
        height: '50%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentView: {
        width: '100%',
        paddingVertical: '10@vs',
        flexDirection: 'row',
        paddingHorizontal: '5%',
        alignItems: 'center',
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        marginLeft: '5@s',
    },
    iconSearch: {
        fontSize: '15@ms',
    },
    totalPostsBox: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.darkTheme.backgroundOpacity(0.4),
    },
    textTotalPosts: {
        fontSize: FONT_SIZE.big,
        color: Theme.common.white,
    },
});

export default ItemHotLocation;
