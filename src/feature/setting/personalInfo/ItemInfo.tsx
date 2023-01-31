import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface BoxInfoProps {
    icon: ReactNode;
    value: string;
    onPressEdit(): void;
}

const ItemInfo = (props: BoxInfoProps) => {
    const {icon, value, onPressEdit} = props;
    const theme = Redux.getTheme();

    return (
        <View style={[styles.container, {borderColor: theme.borderColor}]}>
            <View style={styles.iconModule}>{icon}</View>
            <View style={styles.contentBox}>
                <StyleText
                    originValue={value}
                    customStyle={[styles.textInfo, {color: theme.textColor}]}
                />
            </View>
            <StyleTouchable
                customStyle={styles.iconModule}
                onPress={onPressEdit}>
                <AntDesign
                    name="edit"
                    style={[styles.ic_edit_check, {color: theme.borderColor}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '45@vs',
        borderWidth: 0.5,
        borderRadius: '10@vs',
        flexDirection: 'row',
        marginVertical: '7@vs',
    },
    iconModule: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentBox: {
        flex: 6,
        justifyContent: 'center',
    },
    textInfo: {
        fontSize: FONT_SIZE.normal,
    },
    ic_edit_check: {
        fontSize: '20@ms',
    },
});

export default ItemInfo;
