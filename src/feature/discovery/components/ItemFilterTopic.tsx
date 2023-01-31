import {FONT_SIZE} from 'asset/standardValue';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {ImageStyle, Platform, StyleProp, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    isChosen: boolean;
    icon: any;
    iconStyle?: StyleProp<ImageStyle>;
    title: I18Normalize;
    onPressTopic(): void;
}

const ItemFilterTopic = (props: Props) => {
    const {isChosen, icon, title, onPressTopic, iconStyle} = props;
    const theme = Redux.getTheme();

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <StyleIcon source={icon} size={30} customStyle={iconStyle} />
                <StyleText
                    i18Text={title}
                    customStyle={[styles.title, {color: theme.textColor}]}
                />
            </View>
            <StyleTouchable
                onPress={() => onPressTopic()}
                customStyle={styles.checkTouchable}>
                <View
                    style={[styles.checkBox, {borderColor: theme.borderColor}]}>
                    {isChosen && (
                        <AntDesign
                            name="check"
                            style={[styles.iconCheck, {color: theme.textColor}]}
                        />
                    )}
                </View>
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        paddingLeft: '15@s',
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZE.small,
        marginLeft: '10@s',
    },
    iconCheck: {
        fontSize: '15@ms',
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
});

export default ItemFilterTopic;
