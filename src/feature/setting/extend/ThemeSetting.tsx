import {apiChangeTheme} from 'api/module';
import {THEME_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const ThemeSetting = () => {
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const [isPicked, setIsPicked] = useState(
        theme === Theme.darkTheme ? 'dark' : 'light',
    );

    const selectBdColor = (type: string) => {
        return isPicked === type ? theme.highlightColor : theme.holderColor;
    };

    const switchTheme = async (type: string) => {
        let newTheme = 0;
        if (type === 'dark') {
            newTheme = THEME_TYPE.darkTheme;
        } else if (type === 'light') {
            newTheme = THEME_TYPE.lightTheme;
        }

        try {
            if (!isModeExp) {
                await apiChangeTheme(newTheme);
            }
            Redux.setTheme(newTheme);
            appAlert('alert.successChange');
            setIsPicked(type);
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <View style={styles.container}>
            {/* DARK THEME */}
            <TouchableOpacity
                style={[styles.themeBox, {borderColor: selectBdColor('dark')}]}
                onPress={() => switchTheme('dark')}>
                <StyleImage
                    source={Images.images.darkTheme}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>

            {/* LIGHT THEME */}
            <TouchableOpacity
                style={[styles.themeBox, {borderColor: selectBdColor('light')}]}
                onPress={() => switchTheme('light')}>
                <StyleImage
                    source={Images.images.lightTheme}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    themeBox: {
        width: Metrics.width / 4,
        height: Metrics.width / 4,
        borderWidth: '5@vs',
        borderRadius: '20@vs',
        overflow: 'hidden',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    themeImage: {
        width: '100%',
        height: '100%',
    },
});

export default ThemeSetting;
