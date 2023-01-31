import React, {Component, ReactNode} from 'react';
import {
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleProp,
    ViewStyle,
} from 'react-native';

export interface StyleTouchableProps extends PressableProps {
    customStyle?: StyleProp<ViewStyle>;
    disable?: boolean;
    onPress?(e: GestureResponderEvent): void;
    onLongPress?(): void;
    disableOpacity?: number;
    activeOpacity?: number;
    normalOpacity?: number;
}

export default class StyleTouchable extends Component<StyleTouchableProps> {
    render(): ReactNode {
        const {
            customStyle,
            disable = false,
            onPress,
            onLongPress,
            children,
            disableOpacity = 0.4,
            activeOpacity = 0.8,
            normalOpacity = 1,
        } = this.props;

        return (
            <Pressable
                style={({pressed}) => [
                    customStyle,
                    {
                        opacity: disable
                            ? disableOpacity
                            : pressed
                            ? activeOpacity
                            : normalOpacity,
                        overflow: 'hidden',
                    },
                ]}
                disabled={disable}
                {...this.props}
                onPress={onPress}
                onLongPress={onLongPress}>
                {children}
            </Pressable>
        );
    }
}
