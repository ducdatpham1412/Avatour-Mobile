import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';
import {I18Normalize} from 'utility/I18Next';

interface TypeDetailSettingProps {
    title: I18Normalize;
    icon?: ReactNode;
    onPress?(): void;
}

const TypeDetailSetting = (props: TypeDetailSettingProps) => {
    const theme = Redux.getTheme();
    const {title, icon, onPress} = props;

    return (
        <TouchableOpacity
            style={[
                styles.frameBorderBottomSetting,
                {borderColor: theme.borderColor},
            ]}
            onPress={onPress}>
            <StyleText
                i18Text={title}
                customStyle={[styles.textHeader, {color: theme.textColor}]}
            />
            <View style={styles.iconView}>{icon}</View>
        </TouchableOpacity>
    );
};

const styles = ScaledSheet.create({
    frameBorderBottomSetting: {
        width: '100%',
        borderBottomWidth: isIOS ? 0.25 : 0.5,
        paddingVertical: '8@vs',
        paddingHorizontal: '10@s',
        marginVertical: '17@vs',
        justifyContent: 'center',
    },
    textHeader: {
        fontSize: FONT_SIZE.normal,
    },
    iconView: {
        position: 'absolute',
        right: '25@s',
    },
});

export default TypeDetailSetting;
