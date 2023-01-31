import Images from 'asset/img/images';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleImage, StyleText} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18Next from 'utility/I18Next';

interface Props {
    location: string;
    onChangeLocation(value: string): void;
    theme: TypeTheme;
}

interface States {
    tempLocation: string;
}

let timeout: any;

class ModalCheckIn extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    inputRef = React.createRef<TextInput>();

    state: States = {
        tempLocation: this.props.location,
    };

    show() {
        this.modalRef.current?.open();
        timeout = setTimeout(() => {
            this.inputRef.current?.focus();
        }, 200);
        return () => clearTimeout(timeout);
    }

    private onConfirm(value: string) {
        this.props.onChangeLocation(value);
        this.modalRef.current?.close();
    }

    render() {
        const {location, theme} = this.props;

        return (
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
                                tempLocation: location,
                            });
                        }}
                    />

                    <StyleText
                        i18Text="profile.post.checkIn"
                        customStyle={[styles.title, {color: theme.textColor}]}
                    />

                    <View
                        style={[
                            styles.inputView,
                            {
                                backgroundColor: theme.backgroundTextInput,
                            },
                        ]}>
                        <Ionicons
                            name="ios-location-sharp"
                            style={[
                                styles.iconLocation,
                                {color: theme.textColor},
                            ]}
                        />
                        <TextInput
                            ref={this.inputRef}
                            defaultValue={location}
                            onChangeText={value =>
                                this.setState({
                                    tempLocation: value,
                                })
                            }
                            placeholder={I18Next.t(
                                'profile.post.whereAreYouNow',
                            )}
                            placeholderTextColor={theme.borderColor}
                            style={[styles.input, {color: theme.textColor}]}
                            returnKeyType="done"
                            onSubmitEditing={() =>
                                this.onConfirm(this.state.tempLocation)
                            }
                        />
                    </View>

                    <StyleButton
                        containerStyle={styles.buttonView}
                        titleStyle={styles.titleButton}
                        title="common.save"
                        onPress={() => this.onConfirm(this.state.tempLocation)}
                    />

                    <StyleText
                        i18Text="profile.post.willDebutSearchOnGoogleMap"
                        customStyle={[
                            styles.waitForUsText,
                            {color: theme.borderColor},
                        ]}
                    />
                    <StyleImage
                        source={Images.images.successful}
                        customStyle={styles.imgSquirrel}
                    />
                </View>
            </Modalize>
        );
    }
}

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: '90%',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
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
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    inputView: {
        width: '100%',
        marginTop: '10@vs',
        borderRadius: '5@ms',
        paddingHorizontal: '8@s',
        paddingVertical: '8@vs',
        flexDirection: 'row',
        backgroundColor: 'blue',
    },
    iconLocation: {
        fontSize: '17@ms',
    },
    input: {
        marginVertical: 0,
        paddingVertical: 0,
        maxHeight: '70@vs',
        paddingLeft: '5@s',
        paddingRight: '13@s',
        minWidth: '80%',
    },
    imgSquirrel: {
        width: '150@s',
        height: '150@s',
        marginTop: '20@vs',
    },
    buttonView: {
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        marginTop: '13@vs',
    },
    titleButton: {
        fontSize: '15@ms',
        fontWeight: 'normal',
    },
    waitForUsText: {
        fontSize: '12@ms',
        textAlign: 'center',
        marginTop: '40@vs',
    },
});

export default ModalCheckIn;
