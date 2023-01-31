import {NUMBER_STARS} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    numberStars: number;
    onChangeNumberStars(value: number): void;
}

const ModalPickStars = (props: Props, ref: any) => {
    const {numberStars = 0, onChangeNumberStars} = props;
    const theme = Redux.getTheme();

    const onPress = (index: number) => {
        onChangeNumberStars(index + 1);
    };

    return (
        <Modalize
            ref={ref}
            modalStyle={styles.modal}
            withHandle={false}
            overlayStyle={{
                backgroundColor: theme.backgroundOpacity(),
            }}>
            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <ButtonX
                    containerStyle={styles.buttonClose}
                    onPress={() => ref.current.close()}
                />
                <StyleText
                    i18Text="profile.post.rating"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />
                <View style={styles.starView}>
                    {NUMBER_STARS.map((_, index) => {
                        if (index < numberStars) {
                            return (
                                <StyleTouchable
                                    key={index}
                                    customStyle={styles.starTouch}
                                    onPress={() => onPress(index)}>
                                    <AntDesign
                                        name="star"
                                        style={[
                                            styles.star,
                                            {color: theme.highlightColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            );
                        }
                        return (
                            <StyleTouchable
                                key={index}
                                customStyle={styles.starTouch}
                                onPress={() => onPress(index)}>
                                <AntDesign
                                    name="staro"
                                    style={[
                                        styles.star,
                                        {color: theme.borderColor},
                                    ]}
                                />
                            </StyleTouchable>
                        );
                    })}
                </View>
            </View>
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: '90%',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        marginTop: '100@vs',
        alignSelf: 'center',
        borderRadius: '7@ms',
        alignItems: 'center',
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
    starView: {
        flexDirection: 'row',
        marginTop: '15@vs',
    },
    starTouch: {
        paddingHorizontal: '12@s',
    },
    star: {
        fontSize: '25@ms',
    },
});

export default forwardRef(ModalPickStars);
