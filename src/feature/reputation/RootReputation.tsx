import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleIcon, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {REPUTATION_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import TopTabReputation from './components/TopTabReputation';
import ReputationScreen from './ReputationScreen';
import ReviewCommunity from './ReviewCommunity';

const TopTab = createMaterialTopTabNavigator();

const RootReputation = () => {
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={[
                    styles.headerView,
                    {borderBottomColor: theme.holderColor},
                ]}>
                <StyleIcon
                    source={Images.icons.reputation}
                    size={20}
                    customStyle={{tintColor: theme.highlightColor}}
                />
                <StyleText
                    i18Text="reputation.reviewCommunity"
                    customStyle={[
                        styles.textTitle,
                        {color: theme.textHightLight},
                    ]}
                />
            </View>

            <TopTab.Navigator
                tabBar={(props: MaterialTopTabBarProps) => (
                    <TopTabReputation materialProps={props} />
                )}>
                <TopTab.Screen
                    name={REPUTATION_ROUTE.reviewCommunity}
                    component={ReviewCommunity}
                />
                <TopTab.Screen
                    name={REPUTATION_ROUTE.topReviewers}
                    component={ReputationScreen}
                    options={{
                        lazy: true,
                    }}
                />
            </TopTab.Navigator>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    headerView: {
        paddingHorizontal: '20@s',
        paddingVertical: '3@vs',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
});

export default RootReputation;
