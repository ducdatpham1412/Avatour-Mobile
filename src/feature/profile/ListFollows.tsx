/* eslint-disable react-hooks/rules-of-hooks */
import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {TypeFollowResponse} from 'api/interface';
import {apiGetListFollow} from 'api/module';
import {TYPE_FOLLOW} from 'asset/enum';
import StyleList from 'components/base/StyleList';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import TopTabNavigator from 'navigation/components/TopTabNavigator';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {modeExpUsePaging} from 'utility/assistant';
import ItemFollow from './components/ItemFollow';

interface Props {
    route: {
        params: {
            userId: number;
            name: string;
            type: number;
            onGoBack(): void;
        };
    };
}

const Tab = createMaterialTopTabNavigator();

const RenderItem = (item: TypeFollowResponse) => {
    return <ItemFollow item={item} />;
};

const FollowerScreen = ({route}: any) => {
    const {userId} = route.params;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const {list, refreshing, onRefresh, onLoadMore, setParams} = isModeExp
        ? modeExpUsePaging()
        : usePaging({
              request: apiGetListFollow,
              params: {
                  userId,
                  typeFollow: TYPE_FOLLOW.follower,
              },
          });

    useEffect(() => {
        setParams({userId, typeFollow: TYPE_FOLLOW.follower});
    }, [userId]);

    return (
        <StyleList
            data={list}
            renderItem={({item}: any) => RenderItem(item)}
            style={{backgroundColor: theme.backgroundColor}}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={onLoadMore}
        />
    );
};

const FollowingScreen = ({route}: any) => {
    const {userId} = route.params;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();

    const {list, refreshing, onRefresh, onLoadMore, setParams} = isModeExp
        ? modeExpUsePaging()
        : usePaging({
              request: apiGetListFollow,
              params: {
                  userId,
                  typeFollow: TYPE_FOLLOW.following,
              },
          });

    useEffect(() => {
        setParams({userId, typeFollow: TYPE_FOLLOW.following});
    }, [userId]);

    return (
        <StyleList
            data={list}
            renderItem={({item}: any) => RenderItem(item)}
            style={{backgroundColor: theme.backgroundColor}}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={onLoadMore}
        />
    );
};

/**
 * Boss here
 */
const ListFollows = ({route}: Props) => {
    const {userId, name, type, onGoBack} = route.params;
    const {t} = useTranslation();
    const theme = Redux.getTheme();

    const listTopTab = useMemo(() => {
        return [t('profile.follow.follower'), t('profile.follow.following')];
    }, []);

    const initRoute = useMemo(() => {
        if (type === TYPE_FOLLOW.follower) {
            return 'Follower';
        }
        if (type === TYPE_FOLLOW.following) {
            return 'Following';
        }
        return '';
    }, [type]);

    useEffect(() => {
        if (type === TYPE_FOLLOW.follower) {
            navigate('Follower', {
                userId,
            });
        } else {
            navigate('Following', {
                userId,
            });
        }
    }, [type, userId]);

    return (
        <>
            <ViewSafeTopPadding />
            <StyleHeader title={name} onGoBack={onGoBack} />

            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <Tab.Navigator
                    tabBar={(props: MaterialTopTabBarProps) => (
                        <TopTabNavigator
                            materialProps={props}
                            listRouteName={listTopTab}
                            listRouteParams={[
                                {
                                    userId,
                                },
                                {
                                    userId,
                                },
                            ]}
                        />
                    )}
                    initialRouteName={initRoute}>
                    <Tab.Screen
                        name="Follower"
                        component={FollowerScreen}
                        initialParams={{userId}}
                    />

                    <Tab.Screen
                        name="Following"
                        component={FollowingScreen}
                        initialParams={{userId}}
                    />
                </Tab.Navigator>
            </View>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '30@s',
    },
});

export default ListFollows;
