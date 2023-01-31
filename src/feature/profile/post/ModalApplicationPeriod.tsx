import {FONT_SIZE} from 'asset/standardValue';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleText, StyleTouchable} from 'components/base';
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {Platform, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {addDate, formatDayGroupBuying} from 'utility/format';

interface Props {
    startDate: string | null;
    endDate: string | null;
    theme: TypeTheme;
    onChangeDate(value: {startDate: Date; endDate: Date}): void;
}

interface States {
    startDate: string | null;
    endDate: string | null;
}

class ModalApplicatonPeriod extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    startDateRef = React.createRef<ClassDateTimePicker>();

    endDateRef = React.createRef<ClassDateTimePicker>();

    state: States = {
        startDate: this.props.startDate,
        endDate: this.props.endDate,
    };

    show() {
        this.modalRef.current?.open();
    }

    private onConfirm = () => {
        if (this.state.startDate && this.state.endDate) {
            this.props.onChangeDate({
                startDate: new Date(this.state.startDate),
                endDate: new Date(this.state.endDate),
            });
            this.modalRef.current?.close();
        }
    };

    render() {
        const {theme, startDate, endDate} = this.props;
        const isValid = this.state.startDate && this.state.endDate;

        const Content = () => {
            return (
                <View style={styles.contentView}>
                    <StyleTouchable
                        customStyle={[
                            styles.dateBox,
                            {borderColor: theme.borderColor},
                        ]}
                        onPress={() => this.startDateRef.current?.show()}>
                        {this.state.startDate ? (
                            <StyleText
                                originValue={formatDayGroupBuying(
                                    this.state.startDate,
                                )}
                                customStyle={[
                                    styles.textDate,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        ) : (
                            <>
                                <AntDesign
                                    name="plus"
                                    style={[
                                        styles.iconPlus,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                                <StyleText
                                    i18Text="profile.startDate"
                                    customStyle={[
                                        styles.textDate,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            </>
                        )}
                    </StyleTouchable>

                    <StyleText
                        originValue="~"
                        customStyle={[
                            styles.textMiddle,
                            {color: theme.borderColor},
                        ]}
                    />

                    <StyleTouchable
                        customStyle={[
                            styles.dateBox,
                            {borderColor: theme.borderColor},
                        ]}
                        disable={!this.state.startDate}
                        onPress={() => this.endDateRef.current?.show()}>
                        {this.state.endDate ? (
                            <StyleText
                                originValue={formatDayGroupBuying(
                                    this.state.endDate,
                                )}
                                customStyle={[
                                    styles.textDate,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        ) : (
                            <>
                                <AntDesign
                                    name="plus"
                                    style={[
                                        styles.iconPlus,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                                <StyleText
                                    i18Text="profile.endDate"
                                    customStyle={[
                                        styles.textDate,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            </>
                        )}
                    </StyleTouchable>
                </View>
            );
        };

        return (
            <>
                <Modalize
                    ref={this.modalRef}
                    modalStyle={styles.modal}
                    withHandle={false}>
                    <View
                        style={[
                            styles.container,
                            {backgroundColor: theme.backgroundColor},
                        ]}>
                        <ButtonX
                            containerStyle={styles.buttonClose}
                            onPress={() => {
                                this.modalRef.current?.close();
                                this.setState({
                                    startDate,
                                    endDate,
                                });
                            }}
                        />

                        <StyleText
                            i18Text="discovery.applicationPeriod"
                            customStyle={[
                                styles.title,
                                {color: theme.textColor},
                            ]}
                        />

                        {Content()}

                        <StyleButton
                            containerStyle={styles.buttonView}
                            titleStyle={styles.titleButton}
                            title="common.save"
                            disable={!isValid}
                            onPress={() => this.onConfirm()}
                        />
                    </View>

                    <ClassDateTimePicker
                        ref={this.startDateRef}
                        initDate={
                            this.state.startDate
                                ? new Date(this.state.startDate)
                                : new Date(
                                      addDate(new Date(), {
                                          value: 1,
                                          unit: 'day',
                                      }),
                                  )
                        }
                        minimumDate={
                            new Date(
                                addDate(new Date(), {
                                    value: 1,
                                    unit: 'day',
                                }),
                            )
                        }
                        onChangeDateTime={value =>
                            this.setState({
                                startDate: String(value),
                                endDate: null,
                            })
                        }
                        theme={theme}
                    />
                    <ClassDateTimePicker
                        ref={this.endDateRef}
                        initDate={
                            this.state.endDate
                                ? new Date(this.state.endDate)
                                : new Date(
                                      addDate(new Date(), {
                                          value: 2,
                                          unit: 'day',
                                      }),
                                  )
                        }
                        minimumDate={
                            this.state.startDate
                                ? new Date(
                                      addDate(this.state.startDate, {
                                          value: 1,
                                          unit: 'day',
                                      }),
                                  )
                                : new Date(
                                      addDate(new Date(), {
                                          value: 2,
                                          unit: 'day',
                                      }),
                                  )
                        }
                        onChangeDateTime={value =>
                            this.setState({
                                endDate: String(value),
                            })
                        }
                        theme={theme}
                    />
                </Modalize>
            </>
        );
    }
}

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: '95%',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        marginTop: '100@vs',
        alignSelf: 'center',
        borderRadius: '7@ms',
        alignItems: 'center',
        paddingHorizontal: '10@s',
    },
    buttonClose: {
        position: 'absolute',
        top: '7@s',
        right: '7@s',
    },
    title: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    buttonView: {
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        marginTop: '25@vs',
    },
    titleButton: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    // content
    contentView: {
        width: '100%',
        marginTop: '25@vs',
        flexDirection: 'row',
    },
    dateBox: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5@ms',
        paddingVertical: '8@vs',
    },
    iconPlus: {
        fontSize: '15@ms',
    },
    textDate: {
        fontSize: FONT_SIZE.small,
        marginLeft: '5@s',
    },
    textMiddle: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '7@s',
        alignSelf: 'center',
    },
});

export default ModalApplicatonPeriod;
