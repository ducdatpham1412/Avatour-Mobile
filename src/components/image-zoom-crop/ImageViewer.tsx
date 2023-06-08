import React, {Component, ReactNode, RefObject} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {EasingNode} from 'react-native-reanimated';
import {timing} from './helpers/reanimatedTiming';
import {IConstraint, IImageViewerData} from './types';

interface IProps {
  image: string;
  areaWidth: number;
  areaHeight: number;
  imageWidth: number;
  imageHeight: number;
  minScale: number;
  maxScale?: number;
  onMove: ({positionX, positionY, scale}: IImageViewerData) => void;
  containerColor?: string;
  imageBackdropColor?: string;
  overlay?: ReactNode;
  constraint?: IConstraint;
}

const defaultProps = {
  containerColor: 'black',
  imageBackdropColor: 'black',
};

const {
  Value,
  event,
  block,
  set,
  cond,
  eq,
  and,
  greaterThan,
  greaterOrEq,
  lessThan,
  add,
  sub,
  multiply,
  divide,
  call,
} = Animated;

const styles = StyleSheet.create({
  panGestureInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageWrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {},
});

class ImageViewer extends Component<IProps> {
  pinchRef: RefObject<PinchGestureHandler>;

  dragRef: RefObject<PanGestureHandler>;

  translateX: Animated.Value<number>;

  translateY: Animated.Value<number>;

  scale: Animated.Value<number>;

  onTapGestureEvent: (...args: any[]) => void;

  onPanGestureEvent: (...args: any[]) => void;

  onPinchGestureEvent: (...args: any[]) => void;

  static defaultProps = defaultProps;

  constructor(props: IProps) {
    super(props);

    const {
      areaWidth,
      areaHeight,
      imageWidth,
      imageHeight,
      minScale,
      maxScale = minScale + 3,
      constraint,
    } = props;

    this.pinchRef = React.createRef();
    this.dragRef = React.createRef();

    this.translateX = new Value(0);
    this.translateY = new Value(0);
    this.scale = new Value(minScale);

    const timingDefaultParams = {
      duration: 200,
      easing: EasingNode.linear,
    };

    const offsetX = new Value(0);
    const offsetY = new Value(0);
    const offsetZ = new Value(minScale);

    const viewerAreaWidth = new Value(areaWidth);
    const viewerAreaHeight = new Value(areaHeight);

    const viewerImageWidth = new Value(imageWidth);
    const viewerImageHeight = new Value(imageHeight);

    const scaledWidth = multiply(viewerImageWidth, this.scale);
    const scaledHeight = multiply(viewerImageHeight, this.scale);

    const constraintValue = {
      offset: {
        x: new Value(constraint?.offset.x || 0),
        y: new Value(constraint?.offset.y || 0),
      },
      size: {
        width: constraint?.size.width
          ? new Value(constraint.size.width)
          : viewerAreaWidth,
        height: constraint?.size.height
          ? new Value(constraint.size.height)
          : viewerAreaHeight,
      },
    };

    // when scaling, the translation origin is shifted from
    // intitial origin: this value is the actual shift
    const scalingOriginShiftX = divide(sub(viewerAreaWidth, scaledWidth), 2);
    const scalingOriginShiftY = divide(sub(viewerAreaHeight, scaledHeight), 2);

    // blocked by constraint left edge
    const leftMarginX = constraintValue.offset.x;
    const translateXMax = divide(
      sub(leftMarginX, scalingOriginShiftX),
      this.scale,
    );

    // blocked by constraint rigth edge
    const rightMarginX = add(
      constraintValue.offset.x,
      constraintValue.size.width,
    );
    const translateXMin = divide(
      sub(rightMarginX, scaledWidth, scalingOriginShiftX),
      this.scale,
    );

    // blocked by constraint top edge
    const topMarginY = constraintValue.offset.y;
    const translateYMax = divide(
      sub(topMarginY, scalingOriginShiftY),
      this.scale,
    );

    // blocked by constraint bottom edge
    const bottomMarginY = add(
      constraintValue.offset.y,
      constraintValue.size.height,
    );
    const translateYMin = divide(
      sub(bottomMarginY, scaledHeight, scalingOriginShiftY),
      this.scale,
    );

    const enforceConstraint = block([
      cond(lessThan(this.translateX, translateXMin), [
        set(
          this.translateX,
          timing({
            from: this.translateX,
            to: translateXMin,
            ...timingDefaultParams,
          }),
        ),
      ]),
      cond(greaterThan(this.translateX, translateXMax), [
        set(
          this.translateX,
          timing({
            from: this.translateX,
            to: translateXMax,
            ...timingDefaultParams,
          }),
        ),
      ]),
      cond(lessThan(this.translateY, translateYMin), [
        set(
          this.translateY,
          timing({
            from: this.translateY,
            to: translateYMin,
            ...timingDefaultParams,
          }),
        ),
      ]),
      cond(greaterThan(this.translateY, translateYMax), [
        set(
          this.translateY,
          timing({
            from: this.translateY,
            to: translateYMax,
            ...timingDefaultParams,
          }),
        ),
      ]),
    ]);

    this.onTapGestureEvent = event([
      {
        nativeEvent: ({state}: {state: State}) =>
          block([
            cond(eq(state, State.END), [
              set(offsetZ, new Value(minScale)),
              set(offsetX, new Value(0)),
              set(offsetY, new Value(0)),

              set(
                this.scale,
                timing({
                  from: this.scale,
                  to: minScale,
                  ...timingDefaultParams,
                }),
              ),

              set(
                this.translateX,
                timing({
                  from: this.translateX,
                  to: 0,
                  ...timingDefaultParams,
                }),
              ),

              set(
                this.translateY,
                timing({
                  from: this.translateY,
                  to: 0,
                  ...timingDefaultParams,
                }),
              ),
            ]),
          ]),
      },
    ]);

    this.onPanGestureEvent = event([
      {
        nativeEvent: ({
          translationX,
          translationY,
          state,
        }: {
          translationX: number;
          translationY: number;
          state: State;
        }) =>
          block([
            cond(eq(state, State.ACTIVE), [
              set(
                this.translateX,
                add(divide(translationX, this.scale), offsetX),
              ),
              set(
                this.translateY,
                add(divide(translationY, this.scale), offsetY),
              ),
            ]),

            cond(eq(state, State.END), enforceConstraint),

            cond(eq(state, State.END), [
              set(offsetX, this.translateX),
              set(offsetY, this.translateY),
            ]),
          ]),
      },
    ]);

    this.onPinchGestureEvent = event([
      {
        nativeEvent: ({scale, state}: {scale: number; state: State}) =>
          block([
            cond(
              and(
                eq(state, State.ACTIVE),
                greaterOrEq(multiply(offsetZ, scale), minScale),
              ),
              set(this.scale, multiply(offsetZ, scale)),
            ),

            cond(eq(state, State.END), [set(offsetZ, this.scale)]),

            cond(
              and(
                eq(state, State.END),
                greaterThan(this.scale, new Value(maxScale)),
              ),
              [
                set(offsetZ, new Value(maxScale)),
                set(
                  this.scale,
                  timing({
                    from: this.scale,
                    to: maxScale,
                    ...timingDefaultParams,
                  }),
                ),
              ],
            ),
          ]),
      },
    ]);
  }

  handleMove = (args: readonly number[]): void => {
    const {onMove} = this.props;

    const positionX = args[0];
    const positionY = args[1];
    const scale = args[2];

    onMove({positionX, positionY, scale});
  };

  render() {
    const {
      image,
      imageWidth,
      imageHeight,
      areaWidth,
      areaHeight,
      containerColor,
      imageBackdropColor,
      overlay,
    } = this.props;

    const imageSrc = {
      uri: image,
    };

    const containerStyles = [
      styles.panGestureInner,
      {
        backgroundColor: containerColor,
      },
    ];

    const areaStyles = {
      width: areaWidth,
      height: areaHeight,
      backgroundColor: imageBackdropColor,
    };

    const overlayContainerStyle = {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      height: areaHeight,
      width: areaWidth,
    };

    const imageWrapperStyles = [styles.imageWrapper, areaStyles];

    const imageStyles = [
      styles.image,
      {
        width: imageWidth,
        height: imageHeight,
        transform: [
          {
            scale: this.scale,
          },
          {
            translateX: this.translateX,
          },
          {
            translateY: this.translateY,
          },
        ],
      },
    ];

    return (
      <>
        <Animated.Code>
          {() =>
            block([
              call(
                [this.translateX, this.translateY, this.scale],
                this.handleMove,
              ),
            ])
          }
        </Animated.Code>
        <PanGestureHandler
          ref={this.dragRef}
          simultaneousHandlers={this.pinchRef}
          minPointers={1}
          maxPointers={2}
          avgTouches
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.onPanGestureEvent}>
          <Animated.View style={containerStyles}>
            <TapGestureHandler
              numberOfTaps={2}
              onHandlerStateChange={this.onTapGestureEvent}>
              <Animated.View style={areaStyles}>
                <PinchGestureHandler
                  ref={this.pinchRef}
                  onGestureEvent={this.onPinchGestureEvent}
                  onHandlerStateChange={this.onPinchGestureEvent}>
                  <Animated.View style={imageWrapperStyles} collapsable={false}>
                    <Animated.Image style={imageStyles} source={imageSrc} />
                    {overlay && (
                      <View style={overlayContainerStyle}>{overlay}</View>
                    )}
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
}

export default ImageViewer;
