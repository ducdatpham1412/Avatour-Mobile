/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-constructor */
import {Metrics} from 'asset/metrics';
import React, {ReactNode} from 'react';
import {
  EmitterSubscription,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  extraHeight?: number;
  children: ReactNode;
  onGetKeyBoardHeight?(value: number): void;
}

interface States {
  innerHeight: number;
}

class StyleKeyboardAwareView extends React.Component<Props, States> {
  _maxHeight = 0;

  hadGotKeyboardHeight = false;
  emitterWillShow: EmitterSubscription | undefined = undefined;
  emitterWillHide: EmitterSubscription | undefined = undefined;
  emitterDidShow: EmitterSubscription | undefined = undefined;
  emitterDidHide: EmitterSubscription | undefined = undefined;

  state = {
    innerHeight: 0,
  };

  constructor(props: Props) {
    super(props);
  }

  setMaxHeight = (value: number) => {
    this._maxHeight = value;
  };

  getMaxHeight = () => {
    return this._maxHeight;
  };

  onMainLayout = (e: LayoutChangeEvent) => {
    const {height} = e.nativeEvent.layout;
    this.setMaxHeight(height);
    this.setState({
      innerHeight: height,
    });
  };

  onKeyboardWillShow = (e: KeyboardEvent) => {
    const keyboardHeight = e.endCoordinates.height;
    const newContainerHeight =
      this.getMaxHeight() -
      keyboardHeight -
      (this.props.extraHeight || 0) +
      Metrics.safeBottomPadding;
    this.setState({
      innerHeight: newContainerHeight,
    });
    if (!this.hadGotKeyboardHeight) {
      this.props.onGetKeyBoardHeight?.(keyboardHeight);
      this.hadGotKeyboardHeight = true;
    }
  };

  onKeyboardWillHide = () => {
    this.setState({
      innerHeight: this.getMaxHeight(),
    });
  };

  onKeyboardDidShow = (e: KeyboardEvent) => {
    if (!isIOS) {
      this.onKeyboardWillShow(e);
    }
  };

  onKeyboardDidHide = () => {
    if (!isIOS) {
      this.onKeyboardWillHide();
    }
  };

  attachKeyboardListener = () => {
    this.emitterWillShow = Keyboard.addListener(
      'keyboardWillShow',
      this.onKeyboardWillShow,
    );
    this.emitterWillHide = Keyboard.addListener(
      'keyboardWillHide',
      this.onKeyboardWillHide,
    );

    this.emitterDidShow = Keyboard.addListener(
      'keyboardDidShow',
      this.onKeyboardDidShow,
    );
    this.emitterDidHide = Keyboard.addListener(
      'keyboardDidHide',
      this.onKeyboardDidHide,
    );
  };

  detachKeyboardListener = () => {
    this.emitterWillShow?.remove?.();
    this.emitterWillHide?.remove?.();
    this.emitterDidShow?.remove?.();
    this.emitterDidHide?.remove?.();
  };

  componentDidMount() {
    this.attachKeyboardListener();
  }

  componentWillUnmount() {
    this.detachKeyboardListener();
  }

  render(): ReactNode {
    const {containerStyle, innerStyle, children} = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.container} onLayout={this.onMainLayout}>
          <KeyboardAvoidingView enabled>
            <View style={[innerStyle, {height: this.state.innerHeight}]}>
              {children}
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
});

export default StyleKeyboardAwareView;

// const onKeyboardWillShow = (e: KeyboardEvent) => {
//     const endY = e.endCoordinates.screenY;
//     requestAnimationFrame(() => {
//         outerRef.current?.measure((x, y, width, height, pageX, pageY) => {
//             const remainHeight =
//                 endY - pageY - verticalScale(extraHeightIOS);
//             Animated.timing(aim, {
//                 toValue: remainHeight,
//                 duration: 0,
//                 useNativeDriver: true,
//             }).start();
//         });
//     });
// };
