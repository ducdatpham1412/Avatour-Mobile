import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {ScrollView} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {borderWidthTiny} from 'utility/assistant';

interface Props {
    onTouchBackground(): void;
    onSearch(text: string): void;
}

const SearchSuggestions = (props: Props) => {
    const {onTouchBackground, onSearch} = props;
    const theme = Redux.getTheme();
    const {hotLocations} = Redux.getResource();

    return (
        <StyleTouchable
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    borderTopColor: theme.holderColorLighter,
                },
            ]}
            activeOpacity={1}
            onPress={() => onTouchBackground()}>
            <ScrollView keyboardShouldPersistTaps="always">
                <StyleText
                    i18Text="discovery.hotLocation"
                    customStyle={[styles.textTitle, {color: theme.textColor}]}
                />
                {hotLocations.map(item => (
                    <StyleTouchable
                        key={item.location}
                        customStyle={styles.itemSearchBox}
                        onPress={() => onSearch(item.location)}>
                        <Ionicons
                            name="ios-location-outline"
                            style={[
                                styles.iconSearch,
                                {color: theme.borderColor},
                            ]}
                        />
                        <StyleText
                            originValue={item.location}
                            customStyle={[
                                styles.textSearch,
                                {color: theme.borderColor},
                            ]}
                        />
                        <AntDesign
                            name="search1"
                            style={[styles.iconGo, {color: theme.borderColor}]}
                        />
                    </StyleTouchable>
                ))}
            </ScrollView>
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        borderTopWidth: borderWidthTiny,
        paddingHorizontal: '20@s',
    },
    textTitle: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginTop: '5@vs',
    },
    itemSearchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '15@vs',
        paddingHorizontal: '15@s',
        paddingBottom: '5@vs',
    },
    iconSearch: {
        fontSize: '17@ms',
    },
    textSearch: {
        fontSize: FONT_SIZE.normal,
        marginLeft: '8@s',
    },
    iconGo: {
        fontSize: '13@ms',
        position: 'absolute',
        right: '15@s',
    },
});

export default SearchSuggestions;
