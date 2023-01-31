import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    icon: ReactNode;
    title: I18Normalize;
    onPress(): void;
}

const ItemToolCreatePost = (props: Props) => {
    const {icon, title, onPress} = props;
    const theme = Redux.getTheme();

    return (
        <StyleTouchable customStyle={styles.container} onPress={onPress}>
            {icon}
            <StyleText
                i18Text={title}
                customStyle={[styles.title, {color: theme.borderColor}]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '7@vs',
        marginHorizontal: '20@s',
    },
    title: {
        fontSize: '13@ms',
        marginLeft: '10@s',
    },
});

export default ItemToolCreatePost;
