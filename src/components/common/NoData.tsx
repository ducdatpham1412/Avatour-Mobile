import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface NoDataProps {
    title?: string;
    content?: string;
}

const NoData = (props: NoDataProps) => {
    const {title = '', content = ''} = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleText
                i18Text={title}
                customStyle={[styles.title, {color: theme.textColor}]}
            />
            <StyleText
                i18Text={content}
                customStyle={[styles.content, {color: theme.textColor}]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    content: {
        fontSize: '14@ms',
    },
});

export default NoData;
