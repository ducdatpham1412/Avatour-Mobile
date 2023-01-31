import {TypeGroupBuying} from 'api/interface';
import {apiGetListPostsLiked} from 'api/module';
import {POST_TYPE} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import BubbleGroupBuying from 'feature/discovery/components/BubbleGroupBuying';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {FAVORITE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback} from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width} = Metrics;

const FavoriteEnjoy = () => {
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={[
                    styles.titleView,
                    {borderBottomColor: theme.holderColor},
                ]}>
                <AntDesign
                    name="hearto"
                    style={[styles.iconHeart, {color: theme.likeHeart}]}
                />
                <StyleText
                    i18Text="profile.favorite"
                    customStyle={[
                        styles.textTitle,
                        {color: theme.textHightLight},
                    ]}
                />
            </View>
        </View>
    );
};

const FavoriteAccount = () => {
    const theme = Redux.getTheme();

    const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListPostsLiked,
        params: {
            post_types: `[${POST_TYPE.groupBuying}]`,
        },
    });

    const RenderItem = useCallback((item: TypeGroupBuying) => {
        return (
            <BubbleGroupBuying
                item={item}
                onGoToDetailGroupBuying={() => {
                    navigate(FAVORITE_ROUTE.detailGroupBuying, {
                        item,
                        setList,
                    });
                }}
                onShowMoreOption={() => null}
                onHandleLike={() => null}
                onShowModalComment={(post, type) =>
                    showCommentDiscovery({
                        post,
                        type,
                        setList,
                    })
                }
                onChangePostIdFocusing={() => null}
                detailGroupTarget={FAVORITE_ROUTE.detailGroupBuying}
                containerWidth={width * 0.93}
            />
        );
    }, []);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={[
                    styles.titleView,
                    {borderBottomColor: theme.holderColor},
                ]}>
                <AntDesign
                    name="hearto"
                    style={[styles.iconHeart, {color: theme.likeHeart}]}
                />
                <StyleText
                    i18Text="profile.favorite"
                    customStyle={[
                        styles.textTitle,
                        {color: theme.textHightLight},
                    ]}
                />
            </View>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItem(item)}
                keyExtractor={item => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
            />
        </View>
    );
};

const FavoriteScreen = () => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    if (!isModeExp && token) {
        return <FavoriteAccount />;
    }
    return <FavoriteEnjoy />;
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    titleView: {
        paddingVertical: '3@vs',
        paddingHorizontal: '20@s',
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
    iconHeart: {
        fontSize: '20@ms',
    },
});

export default FavoriteScreen;
