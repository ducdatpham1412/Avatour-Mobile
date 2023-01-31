import {TypePriceResource} from 'app-redux/account/logicSlice';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import React, {Component} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    price: TypePriceResource;
    listPrices: Array<TypePriceResource>;
    onChangePrice(price: TypePriceResource): void;
    theme: TypeTheme;
}

interface States {
    tempPrice: TypePriceResource;
}

// const containerHeight = verticalScale(170) + Metrics.safeTopPadding;

export default class HeaderFilterPrice extends Component<Props, States> {
    aim = new Animated.Value(0);

    containerHeight = 0;

    state: States = {
        tempPrice: this.props.price,
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
            !isEqual(nextProps.price, this.props.price) ||
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
            tempPrice: this.props.price,
        });
        this.hide();
    }

    private onSave() {
        this.props.onChangePrice(this.state.tempPrice);
        this.hide();
    }

    Divider() {
        return (
            <View
                style={[
                    styles.divider,
                    {borderRightColor: this.props.theme.holderColorLighter},
                ]}
            />
        );
    }

    render() {
        const {theme, listPrices} = this.props;
        const {tempPrice} = this.state;

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
                ]}
                onLayout={e => {
                    this.containerHeight = e.nativeEvent.layout.height;
                }}>
                <View style={styles.topicView}>
                    <StyleText
                        i18Text="profile.price"
                        customStyle={[styles.title, {color: theme.borderColor}]}
                    />
                    {listPrices.map(item => {
                        const isChosen = item.id === tempPrice.id;
                        return (
                            <View key={item.id} style={styles.itemView}>
                                {item.value !== null ? (
                                    <StyleText
                                        originValue={item.text}
                                        customStyle={[
                                            styles.textTitle,
                                            {color: theme.textColor},
                                        ]}
                                    />
                                ) : (
                                    <StyleText
                                        i18Text="discovery.all"
                                        customStyle={[
                                            styles.textTitle,
                                            {color: theme.textColor},
                                        ]}
                                    />
                                )}
                                <StyleTouchable
                                    customStyle={styles.checkTouchable}
                                    onPress={() => {
                                        this.setState({
                                            tempPrice: item,
                                        });
                                    }}>
                                    <View
                                        style={[
                                            styles.checkBox,
                                            {borderColor: theme.borderColor},
                                        ]}>
                                        {isChosen && (
                                            <AntDesign
                                                name="check"
                                                style={[
                                                    styles.iconCheck,
                                                    {color: theme.textColor},
                                                ]}
                                            />
                                        )}
                                    </View>
                                </StyleTouchable>
                            </View>
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
    divider: {
        height: '100%',
        borderRightWidth: Platform.select({
            ios: '0.5@ms',
            android: '0.5@ms',
        }),
        alignSelf: 'center',
    },
    itemView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        paddingLeft: '15@s',
    },
    textTitle: {
        fontSize: FONT_SIZE.small,
    },
    checkTouchable: {
        padding: '15@s',
    },
    checkBox: {
        width: '18@ms',
        height: '18@ms',
        borderWidth: Platform.select({
            ios: '1.5@ms',
            android: '1.5@ms',
        }),
        borderRadius: '2@ms',
    },
    iconCheck: {
        fontSize: '15@ms',
    },
});
