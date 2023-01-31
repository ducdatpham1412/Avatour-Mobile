import {useAppSelector} from 'app-redux/store';
import {THEME_TYPE} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const ViewSafeTopPadding = () => {
    const check = useAppSelector(
        state => state.accountSlice.passport.setting.theme,
    );
    const theme =
        check === THEME_TYPE.darkTheme ? Theme.darkTheme : Theme.lightTheme;

    return (
        <View
            style={[styles.container, {backgroundColor: theme.backgroundColor}]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Metrics.safeTopPadding,
    },
});

export default ViewSafeTopPadding;
