import {TOPIC} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, LIST_TOPICS} from 'asset/standardValue';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import React, {Component} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ItemFilterTopic from './components/ItemFilterTopic';

interface Props {
    listTopics: Array<number>;
    onChangeTopic(listTopic: Array<number>): void;
    theme: TypeTheme;
}

interface States {
    tempListTopics: Array<number>;
}

// const containerHeight = verticalScale(170) + Metrics.safeTopPadding;

export default class HeaderFilterTopic extends Component<Props, States> {
    aim = new Animated.Value(0);

    state: States = {
        tempListTopics: this.props.listTopics,
    };

    turnOn = Animated.spring(this.aim, {
        toValue: 1,
        useNativeDriver: true,
    });

    turnOff = Animated.spring(this.aim, {
        toValue: 0,
        useNativeDriver: true,
    });

    shouldComponentUpdate(nextProps: Props, nextStates: States) {
        if (!isEqual(nextStates, this.state)) {
            return true;
        }
        if (
            !isEqual(nextProps.listTopics, this.props.listTopics) ||
            !isEqual(
                nextProps.theme.backgroundColor,
                this.props.theme.backgroundColor,
            )
        ) {
            return true;
        }
        return false;
    }

    show() {
        this.turnOn.stop();
        this.turnOn.start();
    }

    hide() {
        this.turnOff.stop();
        this.turnOff.start();
    }

    private onCancel() {
        this.setState({
            tempListTopics: this.props.listTopics,
        });
        this.hide();
    }

    private onSave() {
        this.props.onChangeTopic(this.state.tempListTopics);
        this.hide();
    }

    private onChooseTopic(topic: number) {
        if (topic === TOPIC.all) {
            this.setState({
                tempListTopics: LIST_TOPICS.map(item => item.id),
            });
        } else {
            let temp = [...this.state.tempListTopics];
            if (temp.includes(topic)) {
                temp = temp.filter(item => {
                    return item !== topic && item !== TOPIC.all;
                });
            } else {
                temp = temp.filter(item => item !== TOPIC.all);
                temp = temp.concat(topic);
            }

            if (!temp.length) {
                return;
            }

            this.setState({
                tempListTopics: temp,
            });
        }
    }

    render() {
        const {theme} = this.props;
        const {tempListTopics} = this.state;

        const translateY = this.aim.interpolate({
            inputRange: [0, 1],
            outputRange: [-Metrics.height, 0],
        });
        const opacity = this.aim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{translateY}],
                        backgroundColor: theme.backgroundColor,
                        opacity,
                        borderColor: theme.holderColor,
                    },
                ]}>
                <View style={styles.topicView}>
                    <StyleText
                        i18Text="discovery.chooseTopic"
                        customStyle={[styles.title, {color: theme.borderColor}]}
                    />

                    {LIST_TOPICS.map(item => {
                        return (
                            <ItemFilterTopic
                                key={item.id}
                                isChosen={tempListTopics.includes(item.id)}
                                icon={item.icon}
                                title={item.text}
                                onPressTopic={() => this.onChooseTopic(item.id)}
                            />
                        );
                    })}
                </View>

                <View
                    style={[
                        styles.footerView,
                        {borderTopColor: theme.holderColorLighter},
                    ]}>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonTouch,
                            {
                                borderRightWidth: 0.5,
                                borderRightColor: theme.holderColorLighter,
                            },
                        ]}
                        onPress={() => this.onCancel()}>
                        <StyleText
                            i18Text="common.cancel"
                            customStyle={[
                                styles.textCancelSave,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </StyleTouchable>
                    <StyleTouchable
                        customStyle={styles.buttonTouch}
                        onPress={() => this.onSave()}>
                        <StyleText
                            i18Text="common.save"
                            customStyle={[
                                styles.textCancelSave,
                                {
                                    color: theme.highlightColor,
                                    fontWeight: 'bold',
                                },
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </Animated.View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        borderBottomRightRadius: '15@ms',
        borderBottomLeftRadius: '15@ms',
        paddingTop: Metrics.safeTopPadding,
        borderWidth: 0.25,
        paddingHorizontal: '20@s',
    },
    title: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginTop: '5@vs',
    },
    topicView: {
        width: '100%',
    },
    footerView: {
        width: '100%',
        flexDirection: 'row',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    buttonTouch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '10@vs',
    },
    textCancelSave: {
        fontSize: FONT_SIZE.normal,
    },
});
