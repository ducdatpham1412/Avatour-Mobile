/* eslint-disable no-shadow */
import Theme from 'asset/theme/Theme';
import {StyleTouchable} from 'components/base';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, I18nManager, Image, View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DefaultTransitionSpec, useAnimatedValue} from 'utility/animation';
import EditZoomCropImage from './EditZoomCropImage';

interface Props {
    images: Array<string>;
    index: number;
    width: number;
    height: number;
    initRatio: number;
    onChangeCropperParams(params: {url: string; value: any}): void;
    onChangeCropperSize(params: {width: number; height: number}): void;
    imageFocusing: string;
    havingZoomButton: boolean;
}

enum TYPE_ZOOM {
    square = 0,
    free = 1,
}

const indicatorPointWidth = scale(10);
const marginIndicatorPoint = scale(5);
const minRatio = 0.7;

const ScrollCropImages = (props: Props) => {
    const {
        images,
        index,
        onChangeCropperParams,
        onChangeCropperSize,
        width,
        height,
        initRatio,
        imageFocusing,
        havingZoomButton,
    } = props;

    const numberTabs = images.length;
    const layOutWidth = width * numberTabs;
    const maxTranslate = layOutWidth * (numberTabs - 1);
    const indicatorWidth =
        indicatorPointWidth * numberTabs +
        marginIndicatorPoint * (numberTabs - 1);

    const checkCropRef = useRef<any>(null);
    const aimWidth = useRef(new Animated.Value(1)).current;
    const aimHeight = useRef(new Animated.Value(1)).current;

    const [cropWidth, setCropWidth] = useState(width);
    const [cropHeight, setCropHeight] = useState(width * initRatio);
    const [typeZoom, setTypeZoom] = useState(TYPE_ZOOM.square);

    aimWidth.addListener(({value}) => setCropWidth(value * width));
    aimHeight.addListener(({value}) => setCropHeight(value * width));

    const panX = useAnimatedValue(0);
    const translateX = Animated.multiply(
        panX.interpolate({
            inputRange: [-maxTranslate, 0],
            outputRange: [-maxTranslate, 0],
            extrapolate: 'clamp',
        }),
        I18nManager.isRTL ? -1 : 1,
    );

    const translateXIndicator = useAnimatedValue(0);
    translateX.addListener(({value}) => {
        if (layOutWidth !== 0) {
            const newTranslateX =
                (-value / layOutWidth) *
                (indicatorWidth + marginIndicatorPoint);
            translateXIndicator.setValue(newTranslateX);
        }
    });

    const jumpToIndex = (__index: number) => {
        const offset = -__index * width;
        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
            timing(panX, {
                ...transitionConfig,
                toValue: offset,
                useNativeDriver: false,
            }),
        ]).start();
    };

    useEffect(() => {
        clearTimeout(checkCropRef.current);
        checkCropRef.current = setTimeout(() => {
            onChangeCropperSize({width: cropWidth, height: cropHeight});
        }, 100);
    }, [cropWidth, cropHeight]);

    useEffect(() => {
        if (index !== undefined) {
            jumpToIndex(index);
        }
    }, [index]);

    const onChangeTypeZoom = () => {
        if (!havingZoomButton) {
            return;
        }
        if (typeZoom === TYPE_ZOOM.square) {
            Image.getSize(imageFocusing, (w, h) => {
                setTypeZoom(TYPE_ZOOM.free);
                if (w < h) {
                    const ratio = w / h < minRatio ? minRatio : w / h;
                    Animated.spring(aimWidth, {
                        toValue: ratio,
                        useNativeDriver: true,
                    }).start();
                } else {
                    const ratio = h / w < minRatio ? minRatio : h / w;
                    Animated.spring(aimHeight, {
                        toValue: ratio,
                        useNativeDriver: true,
                    }).start();
                }
            });
        } else {
            setTypeZoom(TYPE_ZOOM.square);
            Animated.parallel(
                [
                    Animated.spring(aimWidth, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                    Animated.spring(aimHeight, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                ],
                {stopTogether: false},
            ).start();
        }
    };

    return (
        <View style={[styles.container, {width, height}]}>
            <Animated.View
                style={{
                    width: layOutWidth,
                    flexDirection: 'row',
                    transform: [{translateX}],
                }}>
                {images.map(url => (
                    <View
                        key={url}
                        style={{
                            width,
                            height,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <EditZoomCropImage
                            width={cropWidth}
                            height={cropHeight}
                            url={url}
                            onChangeCropperParams={onChangeCropperParams}
                        />
                    </View>
                ))}
            </Animated.View>

            {numberTabs >= 2 && (
                <View style={[styles.indicatorView, {width: indicatorWidth}]}>
                    {Array(numberTabs)
                        .fill(0)
                        .map((_, ind) => (
                            <View key={ind} style={styles.afterBox} />
                        ))}
                    <Animated.View
                        style={[
                            styles.indicator,
                            {transform: [{translateX: translateXIndicator}]},
                        ]}
                    />
                </View>
            )}

            {havingZoomButton && (
                <StyleTouchable
                    style={styles.zoomBox}
                    onPress={onChangeTypeZoom}
                    hitSlop={10}>
                    {typeZoom === TYPE_ZOOM.square ? (
                        <MaterialIcons
                            name="zoom-out-map"
                            style={styles.iconZoom}
                        />
                    ) : (
                        <AntDesign
                            name="minussquareo"
                            style={styles.iconZoom}
                        />
                    )}
                </StyleTouchable>
            )}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: Theme.darkTheme.backgroundColor,
    },
    indicatorView: {
        position: 'absolute',
        height: '2.5@ms',
        alignSelf: 'center',
        bottom: '2@ms',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    afterBox: {
        width: indicatorPointWidth,
        height: '100%',
        backgroundColor: Theme.common.grayLight,
        borderRadius: 10,
    },
    indicator: {
        width: indicatorPointWidth,
        height: '100%',
        borderRadius: 10,
        position: 'absolute',
        backgroundColor: Theme.common.gradientTabBar1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    // zoom box
    zoomBox: {
        position: 'absolute',
        right: '10@s',
        bottom: '10@s',
    },
    iconZoom: {
        fontSize: '20@ms',
        color: Theme.common.white,
    },
});

export default ScrollCropImages;
