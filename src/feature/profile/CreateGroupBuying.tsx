import {apiCreateGroupBuying, apiEditGroupBooking} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {
    TypeCreateGroupBuying,
    TypeEditGroupBooking,
} from 'api/interface/discovery';
import {STATUS, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleContainer,
    StyleIcon,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import LoadingScreen from 'components/LoadingScreen';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import UpdatePriceStatus from 'feature/common/components/UpdatePriceStatus';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {TextInput, Vibration, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    borderWidthTiny,
    chooseIconTopic,
    onGoToSignUp,
} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';
import AddInfoButton from './components/AddInfoButton';
import PreviewVideo from './components/PreviewVideo';
import ModalAddPrice from './post/ModalAddPrice';
import ModalRetailPrice from './post/ModalRetailPrice';
import ModalTopic from './post/ModalTopic';

interface Props {
    route: {
        params: {
            itemNew?: {
                images: Array<string>;
                isVideo: boolean;
            };
            itemEdit?: TypeGroupBuying;
            itemDraft?: TypeGroupBuying;
            itemError?: TypeCreateGroupBuying; // change this to type create gb
        };
    };
}

const {width, safeBottomPadding} = Metrics;

const CreateGroupBuying = ({route}: Props) => {
    const itemNew = useRef(route.params?.itemNew).current;
    const itemEdit = useRef(route.params?.itemEdit).current;
    const itemError = useRef(route.params?.itemError).current;
    const itemDraft = useRef(route.params?.itemDraft).current;
    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    const isLoading = Redux.getIsLoading();
    const {location} = Redux.getPassport().profile;
    const {t} = useTranslation();

    const initValue = useMemo(() => {
        return {
            topics:
                itemEdit?.topic || itemError?.topic || itemDraft?.topic || [],
            content:
                itemEdit?.content ||
                itemError?.content ||
                itemDraft?.content ||
                '',
            images:
                itemEdit?.images ||
                itemError?.images ||
                itemDraft?.images ||
                itemNew?.images ||
                [],
            retailPrice:
                itemEdit?.retailPrice ||
                itemError?.retailPrice ||
                itemDraft?.retailPrice ||
                '',
            groupPrices:
                itemEdit?.prices ||
                itemError?.prices ||
                itemDraft?.prices ||
                [],
            postStatus:
                itemEdit?.postStatus || itemDraft?.postStatus || STATUS.active,
        };
    }, []);

    const [topics, setTopics] = useState(initValue.topics);
    const [content, setContent] = useState(initValue.content);
    const [images] = useState(initValue.images);
    const [retailPrice, setRetailPrice] = useState(initValue.retailPrice);
    const [groupPrices, setGroupPrices] = useState(initValue.groupPrices);
    const [postStatus, setPostStatus] = useState(initValue.postStatus);
    const [requestUpdatePrice, setRequestUpdatePrice] = useState(
        itemEdit?.requestUpdatePrice,
    );

    const modalTopicRef = useRef<Modalize>(null);
    const modalRetailPriceRef = useRef<ModalRetailPrice>(null);
    const modalPriceRef = useRef<ModalAddPrice>(null);
    const scrollRef = useRef<KeyboardAwareScrollView>(null);

    const buttonTopicRef = useRef<AddInfoButton>(null);
    const buttonRetailPriceRef = useRef<AddInfoButton>(null);
    const buttonAddPriceRef = useRef<AddInfoButton>(null);

    const onConfirmPost = async (isDraft: boolean) => {
        if (!topics.length) {
            Vibration.vibrate();
            buttonTopicRef.current?.slug();
            return;
        }
        if (!retailPrice) {
            Vibration.vibrate();
            buttonRetailPriceRef.current?.slug();
            return;
        }
        if (groupPrices.length === 0) {
            Vibration.vibrate();
            buttonAddPriceRef.current?.slug();
            return;
        }

        if (!isModeExp && token) {
            const newGroupBuying: TypeCreateGroupBuying = {
                topic: topics,
                content,
                images,
                retailPrice,
                prices: groupPrices,
                isDraft,
            };
            try {
                Redux.setPostCreatedHandling({
                    status: 'loading',
                    data: newGroupBuying,
                });
                navigate(ROOT_SCREEN.mainScreen);
                const listNameImages = await ImageUploader.upLoadManyImg(
                    newGroupBuying.images,
                    1000,
                );
                // const listNameImages = ['21666863951481.jpeg'];
                const res = await apiCreateGroupBuying({
                    ...newGroupBuying,
                    images: listNameImages,
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewGroupBuying,
                    payload: res.data,
                });
                Redux.setPostCreatedHandling({
                    status: 'success',
                    data: newGroupBuying,
                });
            } catch (err) {
                Redux.setPostCreatedHandling({
                    status: 'error',
                    data: newGroupBuying,
                });
                appAlert(err);
            }
        } else {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
            });
        }
    };

    const onEditPost = async () => {
        if (itemEdit) {
            try {
                Redux.setIsLoading(true);
                const dataEdit: TypeEditGroupBooking = {
                    postId: itemEdit.id,
                    data: {},
                };
                if (content !== initValue.content) {
                    dataEdit.data.content = content;
                }
                if (!isEqual(topics, initValue.topics)) {
                    dataEdit.data.topic = topics;
                }
                await apiEditGroupBooking(dataEdit);
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editGroupBuying,
                    payload: {
                        id: itemEdit.id,
                        content,
                        topic: topics,
                    },
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        } else if (itemDraft) {
            try {
                Redux.setIsLoading(true);
                const dataEdit: TypeEditGroupBooking = {
                    postId: itemDraft.id,
                    data: {},
                };
                if (content !== initValue.content) {
                    dataEdit.data.content = content;
                }
                if (!isEqual(topics, initValue.topics)) {
                    dataEdit.data.topic = topics;
                }
                dataEdit.data.status = STATUS.active;
                if (retailPrice !== initValue.retailPrice) {
                    dataEdit.data.retail_price = retailPrice;
                }
                if (!isEqual(groupPrices, initValue.groupPrices)) {
                    dataEdit.data.prices = groupPrices;
                }

                await apiEditGroupBooking(dataEdit);
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editGroupBuying,
                    payload: {
                        id: itemDraft.id,
                        content,
                        topic: topics,
                        isDraft: false,
                        retailPrice,
                        prices: groupPrices,
                        postStatus: STATUS.active,
                    },
                });
                goBack();
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    const onGoBack = () => {
        const temp: typeof initValue = {
            topics,
            content,
            images,
            retailPrice,
            groupPrices,
            postStatus: initValue.postStatus,
        };
        if (!isEqual(temp, initValue)) {
            appAlertYesNo({
                i18Title: 'common.wantToDiscard',
                agreeText: 'common.discard',
                refuseText: 'common.stay',
                agreeChange: () => {
                    goBack();
                    goBack();
                },
                refuseChange: goBack,
            });
        } else {
            goBack();
        }
    };

    const onChangePostStatus = useCallback(
        async (newPostStatus: number, postId: string) => {
            try {
                Redux.setIsLoading(true);
                await apiEditGroupBooking({
                    postId,
                    data: {
                        status: newPostStatus,
                    },
                });
                setPostStatus(newPostStatus);
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editGroupBuying,
                    payload: {
                        id: postId,
                        postStatus: newPostStatus,
                    },
                });
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        },
        [],
    );

    /**
     * Render views
     */
    const Header = () => {
        let disableButtonEdit = true;
        if (itemEdit) {
            const temp: typeof initValue = {
                topics,
                content,
                images,
                retailPrice,
                groupPrices,
                postStatus: initValue.postStatus,
            };
            disableButtonEdit = isEqual(temp, initValue);
        }

        return (
            <View
                style={[
                    styles.headerView,
                    {
                        borderBottomColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                <StyleTouchable
                    customStyle={styles.iconCloseView}
                    onPress={onGoBack}>
                    <Ionicons
                        name="chevron-back"
                        style={[styles.iconClose, {color: theme.textColor}]}
                    />
                </StyleTouchable>

                {(itemNew || itemError || itemDraft) && (
                    <StyleTouchable
                        customStyle={[
                            styles.postBox,
                            {
                                backgroundColor: theme.highlightColor,
                            },
                        ]}
                        onPress={() => {
                            if (itemDraft) {
                                onEditPost();
                            } else {
                                onConfirmPost(false);
                            }
                        }}>
                        <StyleText
                            i18Text="profile.post.post"
                            customStyle={[
                                styles.textPost,
                                {color: theme.backgroundColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {(itemNew || itemError) && (
                    <StyleTouchable
                        customStyle={[
                            styles.draftBox,
                            {
                                backgroundColor: theme.borderColor,
                            },
                        ]}
                        onPress={() => onConfirmPost(true)}>
                        <StyleText
                            i18Text="profile.post.draft"
                            customStyle={[
                                styles.textDraft,
                                {color: theme.backgroundColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {itemEdit && (
                    <StyleTouchable
                        customStyle={[
                            styles.postBox,
                            {backgroundColor: theme.highlightColor},
                        ]}
                        onPress={() => onEditPost()}
                        disable={disableButtonEdit}>
                        <StyleText
                            i18Text="profile.post.edit"
                            customStyle={[
                                styles.textPost,
                                {color: theme.backgroundColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const ImagePreview = useMemo(() => {
        if (itemNew?.isVideo) {
            return <PreviewVideo uri={images[0]} />;
        }
        return <ScrollSyncSizeImage images={images} syncWidth={width} />;
    }, []);

    const Topic = () => {
        const disableChooseTopic =
            itemEdit && itemEdit.postStatus === STATUS.requestingDelete;

        if (topics.length === 0) {
            return (
                <AddInfoButton
                    ref={buttonTopicRef}
                    borderColor={theme.borderColor}
                    titleColor={theme.textHightLight}
                    title="profile.post.topic"
                    onPress={() => modalTopicRef.current?.open()}
                />
            );
        }

        return (
            <StyleTouchable
                customStyle={styles.topicView}
                onPress={() => modalTopicRef.current?.open()}
                disable={disableChooseTopic}>
                {topics.map(id => {
                    const chosenTopic = chooseIconTopic(id);
                    return (
                        <StyleIcon
                            key={id}
                            source={chosenTopic}
                            size={25}
                            customStyle={styles.iconTopicView}
                        />
                    );
                })}
            </StyleTouchable>
        );
    };

    const InfoBox = () => {
        let textStatus: I18Normalize = 'discovery.available';
        let textButton: I18Normalize = 'discovery.temporarilyClosed';
        let textButtonColor = theme.borderColor;

        const isClosingOrRequestingDelete =
            postStatus === STATUS.temporarilyClose ||
            postStatus === STATUS.requestingDelete;
        if (isClosingOrRequestingDelete) {
            textStatus = 'discovery.temporarilyClosed';
            textButton = 'discovery.openAvailable';
            textButtonColor = theme.highlightColor;
        }

        return (
            <>
                <View style={styles.topicView}>
                    <View
                        style={[
                            styles.infoBox,
                            {borderColor: theme.borderColor},
                        ]}>
                        <Ionicons
                            name="md-location-sharp"
                            style={styles.iconLocation}
                        />
                        <StyleText
                            originValue={location}
                            customStyle={[
                                styles.textLocation,
                                {color: theme.textHightLight},
                            ]}
                            numberOfLines={1}
                        />
                    </View>
                </View>

                <View style={styles.topicView}>
                    <View
                        style={[
                            styles.infoBox,
                            {borderColor: theme.borderColor},
                        ]}>
                        <StyleIcon source={Images.icons.calendar} size={13} />
                        <StyleText
                            i18Text={textStatus}
                            customStyle={[
                                styles.textLocation,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                    {!!itemEdit && (
                        <StyleTouchable
                            customStyle={styles.editStatusBox}
                            onPress={() =>
                                onChangePostStatus(
                                    isClosingOrRequestingDelete
                                        ? STATUS.active
                                        : STATUS.temporarilyClose,
                                    itemEdit.id,
                                )
                            }>
                            <StyleText
                                i18Text={textButton}
                                customStyle={[
                                    styles.textEditStatus,
                                    {color: textButtonColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}
                </View>
            </>
        );
    };

    const RetailPrice = () => {
        const disableEditRetail = !!itemEdit;

        return (
            <View
                style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
                <View style={styles.titlePriceView}>
                    <StyleIcon source={Images.icons.username} size={18} />
                    <StyleText
                        i18Text="discovery.retailPrice"
                        customStyle={[
                            styles.textTitlePrice,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>

                {retailPrice ? (
                    <View style={styles.priceBox}>
                        <View
                            style={[
                                styles.priceValue,
                                {
                                    borderColor: theme.highlightColor,
                                    flex: undefined,
                                },
                            ]}>
                            <StyleText
                                originValue={`${formatLocaleNumber(
                                    retailPrice,
                                )} vnd`}
                                customStyle={[
                                    styles.textNumberPeople,
                                    {
                                        color: theme.highlightColor,
                                        fontWeight: 'bold',
                                    },
                                ]}
                            />
                        </View>

                        {!disableEditRetail && (
                            <StyleTouchable
                                customStyle={styles.buttonEditRetail}
                                onPress={() =>
                                    modalRetailPriceRef.current?.show()
                                }>
                                <StyleText
                                    i18Text="profile.post.edit"
                                    customStyle={[
                                        styles.textEditRetail,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </StyleTouchable>
                        )}
                    </View>
                ) : (
                    <AddInfoButton
                        ref={buttonRetailPriceRef}
                        title="profile.addPrice"
                        titleColor={theme.textHightLight}
                        borderColor={theme.borderColor}
                        onPress={() => {
                            if (!itemEdit) {
                                modalRetailPriceRef.current?.show();
                            }
                        }}
                    />
                )}
            </View>
        );
    };

    const GroupBuyingPrices = () => {
        const onDeletePrice = (valuePrice: string) => {
            setGroupPrices(preValue =>
                preValue.filter(item => item.value !== valuePrice),
            );
        };

        const ButtonPrice = () => {
            if (!itemEdit) {
                return (
                    <AddInfoButton
                        ref={buttonAddPriceRef}
                        title="profile.addPrice"
                        titleColor={theme.textHightLight}
                        borderColor={theme.borderColor}
                        onPress={() => modalPriceRef.current?.show()}
                    />
                );
            }

            if (itemEdit.postStatus === STATUS.requestingDelete) {
                return null;
            }

            if (!requestUpdatePrice) {
                return (
                    <View style={styles.titlePriceView}>
                        <StyleTouchable
                            customStyle={styles.editPriceBox}
                            hitSlop={{
                                right: 15,
                                bottom: 15,
                            }}
                            onPress={() =>
                                navigate(PROFILE_ROUTE.updatePrices, {
                                    item: itemEdit,
                                    onUpdatePrice: (value: TypeGroupBuying) => {
                                        setRequestUpdatePrice({
                                            retailPrice: value.retailPrice,
                                            prices: value.prices,
                                        });
                                    },
                                })
                            }>
                            <StyleText
                                i18Text="profile.editPrice"
                                customStyle={[
                                    styles.textEditPrice,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                );
            }

            return (
                <UpdatePriceStatus
                    postId={itemEdit.id}
                    retailPrice={itemEdit.retailPrice}
                    prices={itemEdit.prices}
                />
            );
        };

        return (
            <View
                style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
                <View style={styles.titlePriceView}>
                    <StyleIcon source={Images.icons.dollar} size={18} />
                    <StyleText
                        i18Text="discovery.groupBuyingPrice"
                        customStyle={[
                            styles.textTitlePrice,
                            {color: theme.textHightLight},
                        ]}
                    />
                </View>

                {groupPrices.map((price, index) => {
                    return (
                        <StyleTouchable
                            key={price.number_people}
                            customStyle={styles.priceBox}
                            onPress={() => {
                                modalPriceRef.current?.show({
                                    numberPeople: String(price.number_people),
                                    priceValue: price.value,
                                    indexEdit: index,
                                });
                            }}
                            disable={!!itemEdit}
                            disableOpacity={1}>
                            <View
                                style={[
                                    styles.priceNumberPeople,
                                    {borderColor: theme.borderColor},
                                ]}>
                                <StyleText
                                    originValue={price.number_people}
                                    customStyle={[
                                        styles.textNumberPeople,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </View>
                            <StyleText
                                originValue="-"
                                customStyle={[
                                    styles.textMiddle,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <View
                                style={[
                                    styles.priceValue,
                                    {borderColor: theme.highlightColor},
                                ]}>
                                <StyleText
                                    originValue={`${formatLocaleNumber(
                                        price.value,
                                    )} vnd`}
                                    customStyle={[
                                        styles.textNumberPeople,
                                        {
                                            color: theme.highlightColor,
                                            fontWeight: 'bold',
                                        },
                                    ]}
                                />
                            </View>
                            {!itemEdit && (
                                <StyleTouchable
                                    customStyle={styles.deleteBox}
                                    hitSlop={10}
                                    onPress={() => onDeletePrice(price.value)}>
                                    <Feather
                                        name="x"
                                        style={[
                                            styles.iconDelete,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            )}
                        </StyleTouchable>
                    );
                })}

                {ButtonPrice()}
            </View>
        );
    };

    const Content = () => {
        const disableEditCaption =
            !!itemEdit && itemEdit.postStatus === STATUS.requestingDelete;

        return (
            <View
                style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
                <TextInput
                    onChangeText={text => {
                        scrollRef.current?.scrollToEnd();
                        setContent(text);
                    }}
                    multiline
                    placeholder={t('common.writeSomething')}
                    placeholderTextColor={theme.borderColor}
                    style={[styles.inputContent, {color: theme.textHightLight}]}
                    defaultValue={initValue.content}
                    editable={!disableEditCaption}
                />
            </View>
        );
    };

    return (
        <>
            <ViewSafeTopPadding />
            {Header()}

            <StyleContainer
                ref={scrollRef}
                containerStyle={styles.container}
                scrollEnabled
                customStyle={styles.contentContainer}
                extraHeight={80}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag">
                {ImagePreview}
                <View style={styles.contentView}>
                    {Topic()}
                    {InfoBox()}
                    {RetailPrice()}
                    {GroupBuyingPrices()}
                    {Content()}
                </View>
            </StyleContainer>

            <ModalTopic
                ref={modalTopicRef}
                topics={topics}
                onChangeListTopics={value => {
                    setTopics(value);
                }}
            />

            <ModalRetailPrice
                ref={modalRetailPriceRef}
                theme={theme}
                price={retailPrice}
                onChangePrice={value => setRetailPrice(value)}
            />
            <ModalAddPrice
                ref={modalPriceRef}
                theme={theme}
                prices={groupPrices}
                onAddPrice={value => setGroupPrices(groupPrices.concat(value))}
                onChangePrice={e => {
                    setGroupPrices(preValue =>
                        preValue.map((item, index) => {
                            if (index !== e.indexEdit) {
                                return item;
                            }
                            return {
                                ...item,
                                number_people: e.value.number_people,
                                value: e.value.value,
                            };
                        }),
                    );
                }}
            />

            {isLoading && <LoadingScreen />}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: safeBottomPadding + 30,
    },
    // header
    headerView: {
        width: '100%',
        paddingVertical: '5@vs',
        paddingHorizontal: '15@s',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: borderWidthTiny,
    },
    iconCloseView: {
        position: 'absolute',
        right: '10@s',
    },
    iconClose: {
        fontSize: '25@ms',
    },
    postBox: {
        paddingHorizontal: '25@s',
        paddingVertical: '3@vs',
        borderRadius: '8@ms',
    },
    textPost: {
        fontSize: '14@ms',
        fontWeight: 'bold',
    },
    draftBox: {
        paddingHorizontal: '15@s',
        paddingVertical: '3@vs',
        borderRadius: '8@ms',
        marginRight: '10@s',
    },
    textDraft: {
        fontSize: '14@ms',
    },
    contentView: {
        width: '100%',
        paddingHorizontal: '15@s',
    },
    topicView: {
        flexDirection: 'row',
        marginTop: '10@vs',
    },
    iconTopicView: {
        marginRight: '20@s',
    },
    chooseTopicView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: borderWidthTiny,
        paddingHorizontal: '13@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    iconTopic: {
        fontSize: '15@ms',
    },
    // titlePrice
    priceView: {
        marginTop: '15@vs',
        paddingTop: '5@vs',
        borderTopWidth: borderWidthTiny,
        paddingHorizontal: '10@s',
    },
    inputContent: {
        fontSize: FONT_SIZE.normal,
    },
    titlePriceView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textTitlePrice: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginLeft: '5@s',
    },
    priceBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    priceNumberPeople: {
        flex: 1,
        paddingVertical: '7@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        alignItems: 'center',
    },
    textMiddle: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '10@s',
    },
    priceValue: {
        flex: 2,
        paddingVertical: '7@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        paddingHorizontal: '20@s',
    },
    deleteBox: {
        marginLeft: '10@s',
    },
    iconDelete: {
        fontSize: '20@ms',
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.small,
    },
    buttonEditRetail: {
        marginLeft: '10@s',
    },
    textEditRetail: {
        fontSize: FONT_SIZE.small,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    infoBox: {
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
        paddingVertical: '5@vs',
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLocation: {
        fontSize: '15@ms',
        color: Theme.common.commentGreen,
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        marginLeft: '3@s',
    },
    editStatusBox: {
        alignSelf: 'center',
        marginLeft: '10@s',
    },
    textEditStatus: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    editPriceBox: {
        paddingTop: '15@vs',
    },
    textEditPrice: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default CreateGroupBuying;
