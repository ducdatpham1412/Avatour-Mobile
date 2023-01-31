import React, {Component} from 'react';
import {
    PanResponder,
    StyleProp,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

interface Props extends ViewProps {
    maxDelay?: number;
    minDelay?: number;
    radius?: number;
    onDoubleClick?(): any;
    onLongPress?(): void;
    delayLongPress?: number;
    onPressOut?(): void;
    customStyle?: StyleProp<ViewStyle>;
}

class StyleTouchHaveDouble extends Component<Props> {
    myPanResponder: any = {};

    timeOut: any;

    prevTouchInfo = {
        prevTouchTimeStamp: 0,
    };

    isDoubleTap = (currentTouchTimeStamp: any) => {
        const {prevTouchTimeStamp} = this.prevTouchInfo;
        const dt = currentTouchTimeStamp - prevTouchTimeStamp;
        const {maxDelay = 210, minDelay = 70} = this.props;

        return dt < maxDelay && dt > minDelay;
    };

    handlePanResponderGrant = () => {
        const currentTouchTimeStamp = Date.now();

        if (this.isDoubleTap(currentTouchTimeStamp)) {
            this.props.onDoubleClick?.();
        }

        this.prevTouchInfo = {
            prevTouchTimeStamp: currentTouchTimeStamp,
        };

        const {onLongPress, delayLongPress = 300} = this.props;
        this.timeOut = setTimeout(() => {
            onLongPress?.();
        }, delayLongPress);
    };

    handlePanResponseRelease = () => {
        clearTimeout(this.timeOut);
        this.props.onPressOut?.();
    };

    UNSAFE_componentWillMount() {
        this.myPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: this.handlePanResponderGrant,
        });
    }

    render() {
        return (
            <View
                style={this.props.customStyle}
                {...this.props}
                // {...this.myPanResponder.panHandlers}
                onTouchStart={this.handlePanResponderGrant}
                onTouchEnd={this.handlePanResponseRelease}>
                {this.props.children}
            </View>
        );
    }
}

export default StyleTouchHaveDouble;
