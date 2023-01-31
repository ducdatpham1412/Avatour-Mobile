import {LIST_FEELINGS} from 'asset/standardValue';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {forwardRef} from 'react';
import {Platform, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    onChangeFeeling(value: number): void;
}

const ModalFeeling = (props: Props, ref: any) => {
    const {onChangeFeeling} = props;
    const theme = Redux.getTheme();

    const onConfirm = (item: any) => {
        onChangeFeeling(item.id);
        ref.current.close();
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
                    i18Text="profile.post.feeling"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />
                <View style={styles.feelingView}>
                    {LIST_FEELINGS.map((item, index) => {
                        const borderRightColor =
                            index !== LIST_FEELINGS.length - 1
                                ? theme.borderColor
                                : 'transparent';
                        return (
                            <StyleTouchable
                                key={item.id}
                                customStyle={[
                                    styles.feelingBox,
                                    {borderRightColor},
                                ]}
                                onPress={() => onConfirm(item)}>
                                <StyleIcon source={item.icon} size={30} />
                                <StyleText
                                    i18Text={item.text}
                                    customStyle={[
                                        styles.textFeeling,
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
    feelingView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '25@vs',
        justifyContent: 'space-between',
    },
    feelingBox: {
        flex: 1,
        alignItems: 'center',
        borderRightWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    textFeeling: {
        fontSize: '8@ms',
        marginTop: '10@vs',
    },
});

export default forwardRef(ModalFeeling);
