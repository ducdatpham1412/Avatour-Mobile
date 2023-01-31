import {TypeGetLikePostsResponse} from 'api/interface';
import {apiFollowUser, apiGetListReactsPost} from 'api/module';
import {REACT, RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {onGoToProfile} from 'utility/assistant';
import {StyleImage, StyleText, StyleTouchable} from './base';

interface Props {
    postId: string;
    updateBubbleFocusing: Function;
}

const onFollowUser = async (params: {userId: number; setList: Function}) => {
    const {userId, setList} = params;
    try {
        await apiFollowUser(userId);
        setList((preValue: Array<TypeGetLikePostsResponse>) => {
            return preValue.map(item => {
                if (item.creator !== userId) {
                    return item;
                }
                return {
                    ...item,
                    relationship: RELATIONSHIP.following,
                };
            });
        });
    } catch (err) {
        appAlert(err);
    }
};

const ListReacts = (props: Props) => {
    const {postId, updateBubbleFocusing} = props;
    const theme = Redux.getTheme();

    const {list, setList, setParams} = usePaging({
        request: apiGetListReactsPost,
        params: {
            idBubble: postId,
            type: REACT.post,
        },
    });

    useEffect(() => {
        setParams({
            idBubble: postId,
            type: REACT.post,
        });
    }, [postId]);

    useEffect(() => {
        if (list.length) {
            updateBubbleFocusing({totalLikes: list.length});
        }
    }, [list.length]);

    return (
        <View style={[styles.container]}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}>
                {list.map((item: TypeGetLikePostsResponse) => {
                    const isBlock = item?.relationship === RELATIONSHIP.block;
                    const notFollowing =
                        item.relationship === RELATIONSHIP.notFollowing;

                    return (
                        <StyleTouchable
                            key={String(item.id)}
                            customStyle={styles.followView}
                            disable={isBlock}
                            onPress={() => onGoToProfile(item.creator)}>
                            <StyleImage
                                source={{uri: item.creatorAvatar}}
                                customStyle={styles.avatar}
                            />
                            <StyleText
                                originValue={item.creatorName}
                                customStyle={[
                                    styles.textName,
                                    {color: theme.textHightLight},
                                ]}
                            />
                            {notFollowing && (
                                <StyleTouchable
                                    customStyle={[
                                        styles.followBox,
                                        {borderColor: theme.borderColor},
                                    ]}
                                    onPress={() =>
                                        onFollowUser({
                                            userId: item.creator,
                                            setList,
                                        })
                                    }>
                                    <StyleText
                                        i18Text="profile.follow.follow"
                                        customStyle={[
                                            styles.textFollow,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            )}
                        </StyleTouchable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width,
        paddingHorizontal: '30@s',
    },
    contentContainer: {
        paddingBottom: Metrics.safeBottomPadding + verticalScale(10),
    },
    followView: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: '10@vs',
        alignItems: 'center',
    },
    avatar: {
        width: '35@s',
        height: '35@s',
        borderRadius: '20@s',
    },
    textName: {
        fontSize: '14@ms',
        marginLeft: '10@s',
        maxWidth: '50%',
    },
    followBox: {
        position: 'absolute',
        right: 0,
        borderWidth: Platform.select({
            ios: '1@ms',
            android: '1@ms',
        }),
        paddingVertical: '3@vs',
        paddingHorizontal: '15@s',
        borderRadius: '5@ms',
    },
    textFollow: {
        fontSize: '10@ms',
    },
});

export default ListReacts;
