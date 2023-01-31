import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import React, {Component} from 'react';
import {Animated, Vibration, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {I18Normalize} from 'utility/I18Next';

interface AddInfoProps {
    borderColor: string;
    titleColor: string;
    title: I18Normalize;
    onPress(): void;
}

class AddInfoButton extends Component<AddInfoProps> {
    scale = new Animated.Value(1);

    translateX = new Animated.Value(0);

    slug() {
        Vibration.vibrate();
        Animated.timing(this.scale, {
            toValue: 1.5,
            useNativeDriver: true,
            duration: 100,
        }).start(() => {
            Animated.sequence([
                Animated.timing(this.translateX, {
                    toValue: 10,
                    duration: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(this.translateX, {
                    toValue: -10,
                    duration: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(this.translateX, {
                    toValue: 10,
                    duration: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(this.translateX, {
                    toValue: 0,
                    duration: 60,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                Animated.timing(this.scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 100,
                }).start();
            });
        });
    }

    render() {
        const {borderColor, titleColor, title, onPress} = this.props;
        return (
            <View style={styles.topicView}>
                <Animated.View
                    style={{
                        transform: [
                            {scale: this.scale},
                            {translateX: this.translateX},
                        ],
                    }}>
                    <StyleTouchable
                        customStyle={[styles.chooseTopicView, {borderColor}]}
                        onPress={onPress}>
                        <AntDesign
                            name="plus"
                            style={[
                                styles.iconTopic,
                                {color: Theme.common.gradientTabBar1},
                            ]}
                        />
                        <StyleText
                            i18Text={title}
                            customStyle={[
                                styles.textTopic,
                                {color: titleColor, fontWeight: 'bold'},
                            ]}
                        />
                    </StyleTouchable>
                </Animated.View>
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    topicView: {
        flexDirection: 'row',
        marginTop: '10@vs',
    },
    iconTopicView: {
        marginRight: '20@s',
    },
    chooseTopicView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: borderWidthTiny,
        paddingHorizontal: '13@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    iconTopic: {
        fontSize: '15@ms',
    },
    textTopic: {
        fontSize: FONT_SIZE.small,
        marginLeft: '7@s',
    },
});

export default AddInfoButton;
