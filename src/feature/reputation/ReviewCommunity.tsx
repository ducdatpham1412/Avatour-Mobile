import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {apiDeletePost, apiGetListBubbleActive} from 'api/module';
import {POST_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleIcon} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import Bubble from 'feature/discovery/components/Bubble';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

let modalOptions: TypeBubblePalace | TypeGroupBuying;

const onDeletePost = (postId: string, setList: any) => {
    const agreeDelete = async () => {
        try {
            await apiDeletePost(postId);
            setList((preValue: Array<TypeBubblePalace>) => {
                return preValue.filter(item => item.id !== postId);
            });
        } catch (err) {
            appAlert(err);
        }
    };
    appAlertYesNo({
        i18Title: 'profile.post.sureDeletePost',
        agreeChange: agreeDelete,
        refuseChange: goBack,
    });
};

const ReviewCommunity = () => {
    const {list, setList, refreshing, onRefresh, onLoadMore, noMore} =
        usePaging({
            request: apiGetListBubbleActive,
            params: {
                postTypes: String(`[${[POST_TYPE.review]}]`),
                include_me: true,
            },
        });

    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();
    const hadLogan = token && !isModeExp;
    const myId = Redux.getPassport().profile.id;

    const optionOtherRef = useRef<any>(null);
    const optionMeRef = useRef<any>(null);
    const [postIdFocusing, setPostIdFocusing] = useState('');

    const onShowModalOption = useCallback(
        (post: TypeBubblePalace | TypeGroupBuying) => {
            modalOptions = post;
            if (post.creator !== myId) {
                optionOtherRef.current?.show();
            } else {
                optionMeRef.current?.show();
            }
        },
        [myId],
    );

    const RenderItemBubble = useCallback(
        (item: TypeBubblePalace) => {
            if (item.postType === POST_TYPE.review) {
                return (
                    <Bubble
                        item={item}
                        onShowMoreOption={params =>
                            onShowModalOption(params.postModal)
                        }
                        onShowModalComment={(post, type) =>
                            showCommentDiscovery({
                                post,
                                type,
                                setList,
                            })
                        }
                        isFocusing={postIdFocusing === item.id}
                        onChangePostIdFocusing={postId =>
                            setPostIdFocusing(postId)
                        }
                    />
                );
            }

            return null;
        },
        [postIdFocusing],
    );

    const FooterComponent = () => {
        if (noMore) {
            return (
                <StyleIcon
                    source={Images.images.successful}
                    size={50}
                    customStyle={{
                        alignSelf: 'center',
                    }}
                />
            );
        }
        return null;
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleList
                data={list}
                renderItem={({item}) => RenderItemBubble(item)}
                keyExtractor={item => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                ListFooterComponent={FooterComponent}
            />

            <StyleActionSheet
                ref={optionOtherRef}
                listTextAndAction={[
                    {
                        text: 'discovery.report.title',
                        action: () => {
                            if (hadLogan && modalOptions) {
                                navigate(ROOT_SCREEN.reportUser, {
                                    idUser: modalOptions.creator,
                                    nameUser: modalOptions.creatorName,
                                });
                            }
                        },
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />
            <StyleActionSheet
                ref={optionMeRef}
                listTextAndAction={[
                    {
                        text: 'profile.post.edit',
                        action: () => {
                            if (modalOptions) {
                                navigate(PROFILE_ROUTE.createPostPreview, {
                                    itemEdit: modalOptions,
                                });
                            }
                        },
                    },
                    {
                        text: 'profile.post.delete',
                        action: () => {
                            if (modalOptions) {
                                onDeletePost(modalOptions.id, setList);
                            }
                        },
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});

export default ReviewCommunity;
