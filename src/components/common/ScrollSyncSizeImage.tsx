/* eslint-disable no-underscore-dangle */
import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {StyleImage} from 'components/base';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import StyleVideo from 'components/base/StyleVideo';
import PinchImage from 'components/PinchImage';
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {
    Animated,
    GestureResponderEvent,
    I18nManager,
    Image,
    PanResponder,
    PanResponderGestureState,
    StyleProp,
    View,
    ViewStyle,
} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import {
    DEAD_ZONE,
    DefaultTransitionSpec,
    isMovingHorizontally,
    swipeVelocityThreshold,
    useAnimatedValue,
} from 'utility/animation';
import {checkFileType} from 'utility/validate';

interface Props {
    images: Array<string>;
    syncWidth: number;
    containerStyle?: StyleProp<ViewStyle>;
    onDoublePress?(): void;
    index?: number;
    onChangeIndex?(value: number): void;
    videoProps?: {
        paused?: boolean;
    };
    children?: ReactNode;
    defaultRatio?: number;
}

const indicatorPointWidth = scale(10);
const marginIndicatorPoint = scale(5);

const ScrollSyncSizeImage = (props: Props) => {
    const {
        images,
        syncWidth,
        containerStyle,
        onDoublePress,
        index,
        onChangeIndex,
        videoProps,
        children,
        defaultRatio = 0,
    } = props;

    const currentIndexRef = useRef(0);
    const numberTabsRef = useRef(0);

    const [ratio, setRatio] = useState(defaultRatio);

    const height = ratio * syncWidth;
    const numberTabs = images.length;
    const layOutWidth = syncWidth * numberTabs;
    const maxTranslate = layOutWidth * (numberTabs - 1);
    const swipeDistanceThreshold = syncWidth / 1.75;
    const indicatorWidth =
        indicatorPointWidth * numberTabs +
        marginIndicatorPoint * (numberTabs - 1);

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

    useEffect(() => {
        numberTabsRef.current = numberTabs;
    }, [numberTabs]);

    const jumpToIndex = (__index: number) => {
        onChangeIndex?.(__index);
        const offset = -__index * syncWidth;
        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
            timing(panX, {
                ...transitionConfig,
                toValue: offset,
                useNativeDriver: false,
            }),
        ]).start(({finished}) => {
            if (finished) {
                currentIndexRef.current = __index;
            }
        });
    };

    // Check can moving
    const canMoveScreen = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;

        const check =
            isMovingHorizontally(event, gestureState) &&
            ((diffX >= DEAD_ZONE && currentIndexRef.current > 0) ||
                (diffX <= -DEAD_ZONE &&
                    currentIndexRef.current < numberTabsRef.current - 1));
        return check;
    };

    // Start grant move
    const startGesture = () => {
        panX.stopAnimation();
        const temp: any = panX;
        panX.setOffset(temp._value);
    };

    // Moving
    const respondToGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;

        if (
            (diffX > 0 && currentIndexRef.current <= 0) ||
            (diffX < 0 && currentIndexRef.current >= numberTabsRef.current - 1)
        ) {
            return;
        }

        panX.setValue(diffX);
    };

    // Finish
    const finishGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        panX.flattenOffset();

        const currentIndex = currentIndexRef.current;
        let nextIndex = currentIndexRef.current;

        if (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
            (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
                Math.abs(gestureState.vx) > swipeVelocityThreshold)
        ) {
            nextIndex = Math.round(
                Math.min(
                    Math.max(
                        0,
                        I18nManager.isRTL
                            ? currentIndex +
                                  gestureState.dx / Math.abs(gestureState.dx)
                            : currentIndex -
                                  gestureState.dx / Math.abs(gestureState.dx),
                    ),
                    numberTabsRef.current - 1,
                ),
            );

            currentIndexRef.current = nextIndex;
        }

        if (!Number.isFinite(nextIndex)) {
            nextIndex = currentIndex;
        }

        jumpToIndex(nextIndex);
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: canMoveScreen,
            onMoveShouldSetPanResponderCapture: canMoveScreen,
            onPanResponderGrant: startGesture,
            onPanResponderMove: respondToGesture,
            onPanResponderTerminate: finishGesture,
            onPanResponderRelease: finishGesture,
            onPanResponderTerminationRequest: () => true,
        }),
    ).current;

    useEffect(() => {
        let isSubscribe = true;
        if (images[0] && checkFileType(images[0]) === 'image') {
            Image.getSize(
                images[0],
                (w, h) => {
                    if (isSubscribe) {
                        setRatio(h / w);
                    }
                },
                () => {
                    if (isSubscribe) {
                        setRatio(1);
                    }
                },
            );
        }

        return () => {
            isSubscribe = false;
        };
    }, [images[0]]);

    useEffect(() => {
        if (index !== undefined) {
            jumpToIndex(index);
        }
    }, [index]);

    return (
        <StyleTouchHaveDouble
            customStyle={[
                containerStyle,
                {
                    width: syncWidth,
                    overflow: 'hidden',
                },
            ]}
            onDoubleClick={onDoublePress}>
            <Animated.View
                style={{
                    width: layOutWidth,
                    flexDirection: 'row',
                    transform: [{translateX}],
                }}
                {...panResponder.panHandlers}>
                {images.map((url, ind) => {
                    const fileType = checkFileType(url);
                    if (fileType === 'image') {
                        return (
                            <PinchImage
                                key={ind}
                                containerStyle={{
                                    width: syncWidth,
                                    height,
                                }}
                                imageProps={{
                                    source: {uri: url},
                                    style: styles.image,
                                }}
                            />
                        );
                    }

                    if (fileType === 'video') {
                        return (
                            <StyleVideo
                                key={ind}
                                source={{
                                    uri: url,
                                }}
                                style={{
                                    width: syncWidth,
                                    height,
                                }}
                                onLoad={e => {
                                    let tempRatio = 1;
                                    if (
                                        e.naturalSize.orientation ===
                                        'landscape'
                                    ) {
                                        tempRatio =
                                            e.naturalSize.height /
                                            e.naturalSize.width;
                                    } else if (
                                        e.naturalSize.orientation === 'portrait'
                                    ) {
                                        tempRatio =
                                            e.naturalSize.width /
                                            e.naturalSize.height;
                                    }
                                    tempRatio =
                                        tempRatio > 1.3 ? 1.3 : tempRatio;
                                    setRatio(tempRatio);
                                }}
                                resizeMode="cover"
                                {...videoProps}
                            />
                        );
                    }

                    return (
                        <StyleImage
                            key={ind}
                            style={{
                                width: syncWidth,
                                height,
                            }}
                            source={{uri: ''}}
                            defaultSource={Images.images.defaultImage}
                        />
                    );
                })}
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

            {children}
        </StyleTouchHaveDouble>
    );
};

const styles = ScaledSheet.create({
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
});

export default ScrollSyncSizeImage;
