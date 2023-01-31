import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    listTextAndActions: Array<{
        id: number;
        text: string;
        action(): void;
    }>;
    // id , text, action
}

const ListElementModalize = (props: Props) => {
    const {listTextAndActions} = props;
    const theme = Redux.getTheme();

    return (
        <View style={styles.container}>
            {listTextAndActions.map(item => (
                <StyleTouchable
                    customStyle={[
                        styles.elementModal,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                            borderBottomColor: theme.borderColor,
                        },
                    ]}
                    onPress={item.action}
                    key={item.id}>
                    <StyleText
                        i18Text={item.text}
                        customStyle={[
                            styles.textElement,
                            {color: theme.textColor},
                        ]}
                    />
                </StyleTouchable>
            ))}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: '20@s',
        position: 'absolute',
        bottom: '50@vs',
    },
    elementModal: {
        width: '100%',
        height: '45@vs',
        borderRadius: '10@vs',
        marginBottom: '3@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textElement: {
        fontSize: '17@ms',
    },
});

export default ListElementModalize;
