import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    materialProps: MaterialTopTabBarProps;
}

const tabBarAssets: Array<{
    id: number;
    icon: any;
    text: I18Normalize;
}> = [
    {
        id: 0,
        icon: Images.icons.travel,
        text: 'reputation.experience',
    },
    {
        id: 1,
        icon: Images.icons.star,
        text: 'reputation.topReviewer',
    },
];

const TopTabReputation = (props: Props) => {
    const {materialProps} = props;
    const {state, navigation, position} = materialProps;
    const {t} = useTranslation();

    const theme = Redux.getTheme();

    const [containerWidth, setContainerWidth] = useState(0);
    const numberTabs = state.routes.length;
    const indicatorWidth = containerWidth / numberTabs;

    const translateX = position.interpolate({
        inputRange: state.routes.map((_, i) => i),
        outputRange: state.routes.map((_, i) => indicatorWidth * i),
    });

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={styles.body}
                onLayout={({nativeEvent}) =>
                    setContainerWidth(nativeEvent.layout.width)
                }>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });

                        if (!isFocused) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    // modify inputRange for custom behavior
                    const inputRange = state.routes.map((_, i) => i);
                    const opacity = position.interpolate({
                        inputRange,
                        outputRange: inputRange.map(i =>
                            i === index ? 1 : 0.4,
                        ),
                    });

                    return (
                        <StyleTouchable
                            accessibilityState={
                                isFocused ? {selected: true} : {}
                            }
                            // accessibilityLabel={options.tabBarAccessibilityLabel}
                            // testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            key={route.key}
                            style={styles.buttonView}>
                            <Animated.Image
                                source={tabBarAssets[index].icon}
                                style={[styles.icon, {opacity}]}
                            />
                            <Animated.Text
                                style={[
                                    styles.titleText,
                                    {color: theme.textColor},
                                ]}>
                                {t(tabBarAssets[index].text)}
                            </Animated.Text>
                        </StyleTouchable>
                    );
                })}
            </View>

            <Animated.View
                style={{
                    width: indicatorWidth,
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.borderColor,
                    transform: [{translateX}],
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '20@s',
    },
    body: {
        width: '100%',
        flexDirection: 'row',
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: '10@vs',
    },
    titleText: {
        fontSize: FONT_SIZE.tiny,
        marginTop: '3@vs',
    },
    icon: {
        width: '20@ms',
        height: '20@ms',
    },
});

export default TopTabReputation;
