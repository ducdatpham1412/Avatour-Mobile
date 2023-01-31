/* eslint-disable no-underscore-dangle */
import {Metrics} from 'asset/metrics';
import React, {Children, Component, ReactNode} from 'react';
import {
    Animated,
    GestureResponderEvent,
    I18nManager,
    PanResponder,
    PanResponderGestureState,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import {
    DEAD_ZONE,
    DefaultTransitionSpec,
    isMovingHorizontally,
    swipeVelocityThreshold,
} from 'utility/animation';

interface TypeNativeEvent {
    position: number;
    index: number;
}

interface Props {
    children: ReactNode;
    initIndex?: number;
    onFirstNavigateToIndex?(value: number): void;
    onChangeTabIndex?(index: number): void;
    onScroll?(e: TypeNativeEvent): void;
    containerStyle?: StyleProp<ViewStyle>;
    enableScroll?: boolean;
}

interface States {
    listCheckLazy: Array<boolean>;
    layOutWidth: number;
}

const screenWidth = Metrics.width;
const swipeDistanceThreshold = screenWidth / 1.75;

class StyleTabView extends Component<Props, States> {
    panX = new Animated.Value(-(this.props.initIndex || 0) * screenWidth);

    currentIndexRef = this.props.initIndex || 0;

    animation = {
        numberTabs: 0,
        maxTranslateX: 0,
    };

    listCheckLazyRef: Array<boolean> = [];

    state: States = {
        listCheckLazy: [],
        layOutWidth: 0,
    };

    __canMoveScreen = true;

    private canMoveScreen = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        if (
            this.__canMoveScreen === false ||
            this.props.enableScroll === false
        ) {
            return false;
        }
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
        const check =
            isMovingHorizontally(event, gestureState) &&
            ((diffX >= DEAD_ZONE && this.currentIndexRef > 0) ||
                (diffX <= -DEAD_ZONE &&
                    this.currentIndexRef < this.animation.numberTabs - 1));
        return check;
    };

    private startGesture = () => {
        this.panX.stopAnimation();
        const temp: any = this.panX;
        this.panX.setOffset(temp._value);
    };

    private respondToGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;

        if (
            (diffX > 0 && this.currentIndexRef <= 0) ||
            (diffX < 0 && this.currentIndexRef >= this.animation.numberTabs - 1)
        ) {
            return;
        }
        this.panX.setValue(diffX);
    };

    private jumpToIndex = (index: number) => {
        this.currentIndexRef = index;
        const offset = -index * screenWidth;
        if (this.listCheckLazyRef[index] === false) {
            this.setState(preValue => ({
                listCheckLazy: preValue.listCheckLazy.map((value, ind) => {
                    if (ind !== index) return value;
                    return true;
                }),
            }));
        }

        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
            timing(this.panX, {
                ...transitionConfig,
                toValue: offset,
                useNativeDriver: false,
            }),
        ]).start(({finished}) => {
            if (finished) {
                if (this.listCheckLazyRef[index] === false) {
                    this.props.onFirstNavigateToIndex?.(index);
                    this.listCheckLazyRef[index] = true;
                }
                this.props.onChangeTabIndex?.(index);
            }
        });
    };

    private finishGesture = (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
    ) => {
        this.panX.flattenOffset();

        const currentIndex = this.currentIndexRef;
        let nextIndex = this.currentIndexRef;

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
                    this.animation.numberTabs - 1,
                ),
            );

            this.currentIndexRef = nextIndex;
        }

        if (!Number.isFinite(nextIndex)) {
            nextIndex = currentIndex;
        }

        this.jumpToIndex(nextIndex);
    };

    private panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: this.canMoveScreen,
        onMoveShouldSetPanResponderCapture: this.canMoveScreen,
        onPanResponderGrant: this.startGesture,
        onPanResponderMove: this.respondToGesture,
        onPanResponderTerminate: this.finishGesture,
        onPanResponderRelease: this.finishGesture,
        onPanResponderTerminationRequest: () => true,
    });

    navigateToIndex(index: number) {
        this.jumpToIndex(index);
    }

    disableTouchable() {
        this.__canMoveScreen = false;
    }

    enableTouchable() {
        this.__canMoveScreen = true;
    }

    componentDidMount() {
        const {initIndex = 0, children} = this.props;
        const numberTabs = Children.toArray(children).length;
        const layOutWidth = screenWidth * numberTabs;
        const maxTranslateX = layOutWidth * (numberTabs - 1);

        const temp = [];
        for (let i = 0; i < numberTabs; i++) {
            temp.push(initIndex === i);
        }
        this.listCheckLazyRef = temp;
        this.animation = {
            numberTabs,
            maxTranslateX,
        };
        this.setState({
            listCheckLazy: temp,
            layOutWidth,
        });

        this.props.onFirstNavigateToIndex?.(initIndex);

        this.panX.addListener(({value}) => {
            if (this.props.onScroll) {
                const position = Math.abs(value / layOutWidth);
                const index = Math.round(position * numberTabs);
                this.props.onScroll?.({
                    position,
                    index,
                });
            }
        });
    }

    render() {
        const {children, containerStyle} = this.props;

        const translateX = Animated.multiply(
            this.panX.interpolate({
                inputRange: [-this.animation.maxTranslateX, 0],
                outputRange: [-this.animation.maxTranslateX, 0],
                extrapolate: 'clamp',
            }),
            I18nManager.isRTL ? -1 : 1,
        );

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        width: this.state.layOutWidth,
                        transform: [{translateX}],
                    },
                    containerStyle,
                ]}
                {...this.panResponder.panHandlers}>
                {Children.toArray(children).map((view, ind) => {
                    if (this.state.listCheckLazy[ind]) {
                        return view;
                    }
                    return <View key={ind} style={{width: screenWidth}} />;
                })}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});

export default StyleTabView;
