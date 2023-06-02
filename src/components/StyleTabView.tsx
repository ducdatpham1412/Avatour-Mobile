import {Metrics} from 'asset/metrics';
import React, {Children, Component, ReactNode} from 'react';
import {
  Animated,
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {
  DEAD_ZONE,
  DefaultTransitionSpec,
  isMovingHorizontally,
  swipeVelocityThreshold,
} from 'utility/animation';

export interface TypeNativeEvent {
  position: number;
  index: number;
}

export interface TabViewProps {
  children: ReactNode;
  initIndex?: number;
  onFirstNavigateToIndex?(value: number): void;
  onChangeTabIndex?(index: number): void;
  onScroll?(e: TypeNativeEvent): void;
  onIsScrolling?: (value: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  enableScroll?: boolean;
  lazy?: boolean;
  //   containerWidth?: number;
}

interface States {
  listCheckLazy: Array<boolean>;
  elementWidth: number;
}

const {width: screenWidth} = Metrics;
const swipeDistanceThreshold = screenWidth / 1.75;

class StyleTabView extends Component<TabViewProps, States> {
  panX = new Animated.Value(-(this.props.initIndex || 0) * screenWidth);

  currentIndexRef = this.props.initIndex || 0;

  animation = {
    numberTabs: 0,
    maxTranslateX: 0,
  };

  state: States = {
    listCheckLazy: [],
    elementWidth: screenWidth,
  };

  __canMoveScreen = true;

  private canMoveScreen = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (this.__canMoveScreen === false || this.props.enableScroll === false) {
      return false;
    }
    const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
    const isMovingHorizon = isMovingHorizontally(event, gestureState);
    const check =
      isMovingHorizon &&
      ((diffX >= DEAD_ZONE && this.currentIndexRef > 0) ||
        (diffX <= -DEAD_ZONE &&
          this.currentIndexRef < this.animation.numberTabs - 1));
    if (isMovingHorizon && this.props.onIsScrolling) {
      this.props.onIsScrolling?.(true);
    }
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
    this.props.onChangeTabIndex?.(index);
    this.currentIndexRef = index;
    const offset = -index * this.state.elementWidth;
    if (this.state.listCheckLazy[index] === false) {
      this.setState(preValue => ({
        listCheckLazy: preValue.listCheckLazy.map((value, ind) => {
          if (ind !== index) {
            return value;
          }
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
        if (this.state.listCheckLazy[index] === false) {
          this.props.onFirstNavigateToIndex?.(index);
          this.state.listCheckLazy[index] = true;
        }
      }
    });
  };

  private finishGesture = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    this.panX.flattenOffset();

    if (this.props.onIsScrolling) {
      this.props.onIsScrolling(false);
    }

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
              ? currentIndex + gestureState.dx / Math.abs(gestureState.dx)
              : currentIndex - gestureState.dx / Math.abs(gestureState.dx),
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

  private onPanResponseEnd = () => {
    if (this.props.onIsScrolling) {
      this.props.onIsScrolling(false);
    }
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

  onLayOut(width: number) {
    this.setState({
      elementWidth: width,
    });
    const {initIndex = 0, children} = this.props;
    const numberTabs = Children.toArray(children).length;
    const temp = [];
    for (let i = 0; i < numberTabs; i++) {
      temp.push(initIndex === i);
    }
    const layOutWidth = width * numberTabs;
    const maxTranslateX = layOutWidth * (numberTabs - 1);

    this.animation = {
      numberTabs,
      maxTranslateX,
    };
    this.setState({
      listCheckLazy: temp,
    });

    this.props.onFirstNavigateToIndex?.(initIndex);
    this.panX.removeAllListeners();
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

  onLayOutAnimatedView() {
    const numberTabs = Children.toArray(this.props.children).length;
    const maxTranslateX = this.state.elementWidth * (numberTabs - 1);
    this.animation = {
      numberTabs,
      maxTranslateX,
    };

    // const newListCheckLazy: boolean[] = [];
    // Children.toArray(this.props.children).forEach((_, index) => {
    //   newListCheckLazy.push(this.state.listCheckLazy[index] ?? false);
    // });

    // this.setState(
    //   {
    //     listCheckLazy: newListCheckLazy,
    //   },
    //   () => {
    //     this.jumpToIndex(newListCheckLazy.length - 1);
    //   },
    // );
  }

  render() {
    const {children, containerStyle, lazy = true} = this.props;
    const {elementWidth} = this.state;

    const translateX = Animated.multiply(
      this.panX.interpolate({
        inputRange: [-this.animation.maxTranslateX, 0],
        outputRange: [-this.animation.maxTranslateX, 0],
        extrapolate: 'clamp',
      }),
      I18nManager.isRTL ? -1 : 1,
    );

    return (
      <View
        style={[$container, containerStyle, {paddingLeft: 0, paddingRight: 0}]}
        // You cant not specify padding horizontal for TabView
        // Set it in view children instead
        onLayout={({nativeEvent}) => this.onLayOut(nativeEvent.layout.width)}>
        <Animated.View
          style={[
            $tabContainer,
            {
              transform: [{translateX}],
              width: Children.toArray(children).length * elementWidth,
            },
          ]}
          {...this.panResponder.panHandlers}
          onTouchEnd={() => this.onPanResponseEnd()}
          onLayout={e => {
            this.onLayOutAnimatedView();
          }}>
          {Children.toArray(children).map((view, ind) => {
            return (
              <View key={ind} style={{width: elementWidth}}>
                {lazy ? this.state.listCheckLazy[ind] && view : view}
              </View>
            );
          })}
        </Animated.View>
      </View>
    );
  }
}

const $container: ViewStyle = {
  width: '100%',
  overflow: 'hidden',
};
const $tabContainer: ViewStyle = {
  flexDirection: 'row',
  height: '100%',
};

export default StyleTabView;
