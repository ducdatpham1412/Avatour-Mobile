/* eslint-disable react-hooks/rules-of-hooks */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TypeBubblePalace,
    TypeCreateGroupResponse,
    TypeGradient,
    TypeGroupBuying,
    TypeInteractBubble,
    TypeMemberInListChatTag,
} from 'api/interface';
import FindmeStore from 'app-redux/store';
import {
    FEELING,
    GENDER_TYPE,
    LANGUAGE_TYPE,
    RELATIONSHIP,
    SIGN_UP_TYPE,
    TYPE_COLOR,
} from 'asset/enum';
import Images from 'asset/img/images';
import {
    LIST_POST_TYPES,
    LIST_TOPICS,
    PRIVATE_AVATAR,
} from 'asset/standardValue';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    SETTING_ROUTE,
} from 'navigation/config/routes';
import {navigate, push, showSwipeImages} from 'navigation/NavigationService';
import {useState} from 'react';
import {DevSettings, NativeScrollEvent, Platform} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {I18Normalize} from './I18Next';
import ImageUploader, {ImagePickerParamsType} from './ImageUploader';
import AuthenticateService from './login/loginService';
import {checkCamera, checkPhoto} from './permission/permission';

export const interactBubble = (params: TypeInteractBubble) => {
    navigate(ROOT_SCREEN.interactBubble, params);
};

export const choosePrivateAvatar = (_gender?: number) => {
    const gender =
        _gender ||
        FindmeStore.getState().accountSlice.passport.information.gender;

    switch (gender) {
        case GENDER_TYPE.man:
            return PRIVATE_AVATAR.boy;
        case GENDER_TYPE.woman:
            return PRIVATE_AVATAR.girl;
        case GENDER_TYPE.notToSay:
            return PRIVATE_AVATAR.lgbt;
        default:
            return '';
    }
};

/**
 * FOR EDIT PROFILE THAT IMAGE PICKER
 */
export const chooseImageFromLibrary = async (
    action: Function,
    params?: ImagePickerParamsType,
    callBackFunction?: Function,
) => {
    try {
        const permission = await checkPhoto();
        if (permission) {
            const localPath: any = await ImageUploader.chooseImageFromLibrary(
                params,
            );

            callBackFunction?.();

            if (params?.multiple) {
                action(localPath.map((item: any) => item.path));
            } else {
                action(localPath.path);
            }
        }
    } catch (err) {
        logger(err);
    }
};

export const chooseImageFromCamera = async (
    action: Function,
    params?: ImagePickerParamsType,
    callBackFunction?: Function,
) => {
    try {
        const permission = await checkCamera();
        if (permission) {
            const localPath: any = await ImageUploader.chooseImageFromCamera(
                params,
            );

            callBackFunction?.();

            if (params?.multiple) {
                action(localPath.map((item: any) => item.path));
            } else {
                action(localPath.path);
            }
        }
    } catch (err) {
        logger(err);
    }
};

/**
 * OTHERS
 */

export const isIOS = Platform.OS === 'ios';

export const optionsImagePicker = [
    'common.chooseFromCamera',
    'common.chooseFromLibrary',
    'common.cancel',
];

export function logger(...args: any) {
    if (__DEV__) {
        console.log(...args);
    }
}

export const renderListGender = [
    {
        id: GENDER_TYPE.man,
        name: 'login.detailInformation.man',
    },
    {
        id: GENDER_TYPE.woman,
        name: 'login.detailInformation.woman',
    },
    {
        id: GENDER_TYPE.notToSay,
        name: 'login.detailInformation.notToSay',
    },
];

export const chooseTextFromIdGender = (id: number | undefined) => {
    const temp = renderListGender.find(item => item.id === id);
    return temp?.name || '';
};

export const chooseLanguageFromId = (id: number) => {
    let tempLanguage = '';
    if (id === LANGUAGE_TYPE.en) {
        tempLanguage = 'en';
    } else if (id === LANGUAGE_TYPE.vi) {
        tempLanguage = 'vi';
    }
    return tempLanguage;
};

export const modalizeGoToChatTagFromGroup = (params: {chatTagId: string}) => {
    return [
        {
            text: 'profile.screen.goToChatTag',
            action: () => {
                Redux.setChatTagFromNotification(params.chatTagId);
            },
        },
        {
            text: 'common.cancel',
            action: () => null,
        },
    ];
};

export const modalizeOptionBubbleGroup = (params: {
    itemGroupFromEdit: TypeCreateGroupResponse | undefined;
    deleteAGroupFromList: any;
}) => {
    return [
        {
            text: 'profile.post.edit',
            action: () => {
                navigate('profile_create_group', {
                    itemGroupFromEdit: params.itemGroupFromEdit,
                });
            },
        },
        {
            text: 'profile.post.delete',
            action: params.deleteAGroupFromList,
        },
        {
            text: 'common.cancel',
            action: () => null,
        },
    ];
};

export const renderIconGender = (_gender?: number) => {
    const gender =
        _gender === undefined
            ? FindmeStore.getState().accountSlice.passport.information.gender
            : _gender;

    if (gender === GENDER_TYPE.man) {
        return Images.icons.boy;
    }
    if (gender === GENDER_TYPE.woman) {
        return Images.icons.girl;
    }
    if (gender === GENDER_TYPE.notToSay) {
        return Images.icons.lgbt;
    }
    return null;
};

export const onGoToSignUp = () => {
    AuthenticateService.logOut({
        hadRefreshTokenBlacked: true,
        callBack: () => {
            navigate(LOGIN_ROUTE.signUpForm, {
                typeSignUp: SIGN_UP_TYPE.email,
            });
        },
    });
};

/**
 * MESSAGE
 */
export const moveMeToEndOfListMember = (
    listMember: Array<TypeMemberInListChatTag>,
) => {
    const myId = FindmeStore.getState().accountSlice.passport.profile.id;

    const temp = [...listMember];
    let memberMe: any;

    let myIndex = -1;

    listMember.forEach((item, index) => {
        if (item.id === myId) {
            myIndex = index;
            memberMe = item;
            temp.splice(index, 1);
        }
    });

    if (myIndex === -1) {
        return temp;
    }
    return temp.concat(memberMe);
};

export const reorderListChatTag = (listChatTag: Array<any>, index: number) => {
    const temp = [listChatTag[index]];
    listChatTag.splice(index, 1);
    return temp.concat(listChatTag);
};

export const modeExpUsePaging = () => {
    const [list, setList] = useState<Array<any>>([]);

    return {
        list,
        noMore: true,
        refreshing: false,
        loadingMore: false,
        error: '',
        onRefresh: () => null,
        onLoadMore: () => null,
        setParams: () => null,
        setList,
    };
};

export const modalizeMyProfile: Array<{
    text: I18Normalize;
    action: any;
}> = [
    {
        text: 'profile.component.infoProfile.editProfile',
        action: () => navigate(PROFILE_ROUTE.editProfile),
    },
    {
        text: 'profile.modalize.myInfo',
        action: () =>
            navigate(PROFILE_ROUTE.settingRoute, {
                screen: SETTING_ROUTE.personalInformation,
            }),
    },
    {
        text: 'profile.upgradeAccount',
        action: () => {
            push(ROOT_SCREEN.upgradeAccount);
        },
    },
    {
        text: 'common.cancel',
        action: () => null,
    },
];

export const modalizeMyProfileShop: Array<{
    text: I18Normalize;
    action: any;
}> = [
    {
        text: 'profile.component.infoProfile.editProfile',
        action: () => navigate(PROFILE_ROUTE.editProfile),
    },
    {
        text: 'profile.modalize.myInfo',
        action: () =>
            navigate(PROFILE_ROUTE.settingRoute, {
                screen: SETTING_ROUTE.personalInformation,
            }),
    },
    {
        text: 'common.cancel',
        action: () => null,
    },
];

export const chooseColorGradient = (params: {
    listGradients: TypeGradient;
    colorChoose: number;
}) => {
    const {listGradients, colorChoose} = params;
    let color = listGradients.talking;
    switch (colorChoose) {
        case TYPE_COLOR.talking:
            color = listGradients.talking;
            break;
        case TYPE_COLOR.movie:
            color = listGradients.movie;
            break;
        case TYPE_COLOR.technology:
            color = listGradients.technology;
            break;
        case TYPE_COLOR.gaming:
            color = listGradients.gaming;
            break;
        case TYPE_COLOR.animal:
            color = listGradients.animal;
            break;
        case TYPE_COLOR.travel:
            color = listGradients.travel;
            break;
        case TYPE_COLOR.fashion:
            color = listGradients.fashion;
            break;
        case TYPE_COLOR.other:
            color = listGradients.other;
            break;
        default:
            color = listGradients.talking;
    }
    return color;
};

export function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

export const addMenuClearAsyncStorage = () => {
    if (__DEV__) {
        DevSettings.addMenuItem('Clear AsyncStorage', () => {
            AsyncStorage.clear();
            DevSettings.reload();
        });
    }
};

const paddingBottomCheckScroll = verticalScale(70);
export const isScrollCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
}: NativeScrollEvent) => {
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingBottomCheckScroll
    );
};

export const chooseIconFeeling = (feeling: number) => {
    switch (feeling) {
        case FEELING.nice:
            return Images.icons.nice;
        case FEELING.cute:
            return Images.icons.cute;
        case FEELING.wondering:
            return Images.icons.wondering;
        case FEELING.cry:
            return Images.icons.cry;
        case FEELING.angry:
            return Images.icons.angry;
        default:
            return null;
    }
};

export const chooseTextTopic = (topic: number | null): I18Normalize => {
    return LIST_TOPICS.find(item => item.id === topic)?.text || 'common.null';
};

export const chooseIconTopic = (topic: number) => {
    return LIST_TOPICS.find(item => item.id === topic)?.icon || null;
};

export const chooseIconPostType = (postType: number) => {
    return LIST_POST_TYPES.find(item => item.id === postType)?.icon || null;
};

export const fakeBubbleFocusing: TypeBubblePalace = {
    id: '',
    postType: 0,
    topic: [0],
    feeling: 0,
    location: '',
    link: '',
    content: '',
    images: [],
    stars: 0,
    totalLikes: 0,
    totalComments: 0,
    totalSaved: 0,
    creator: 0,
    creatorName: '',
    creatorAvatar: '',
    created: '',
    isLiked: false,
    isSaved: false,
    isDraft: false,
    relationship: 0,
};

export const fakeGroupBuying: TypeGroupBuying = {
    id: '',
    postType: 1,
    topic: [],
    content: '',
    images: [],
    retailPrice: '',
    prices: [],
    deposit: null,
    amount: null,
    note: null,
    totalLikes: 0,
    totalComments: 0,
    totalGroups: 0,
    totalPersonals: 0,
    creator: 0,
    creatorName: '',
    creatorAvatar: '',
    creatorLocation: '',
    created: '',
    isLiked: false,
    isDraft: false,
    status: 1,
    postStatus: 1,
    relationship: RELATIONSHIP.notKnow,
    joinId: '',
    requestUpdatePrice: null,
};

export const onGoToProfile = (userId: number, params = {}) => {
    const isModeExp = FindmeStore.getState().accountSlice.modeExp;
    if (isModeExp) {
        return;
    }
    const myId = FindmeStore.getState().accountSlice.passport.profile.id;
    if (userId === myId) {
        navigate(ROOT_SCREEN.myProfile);
        // push(ROOT_SCREEN.otherProfile, {
        //     id: userId,
        // });
    } else {
        push(ROOT_SCREEN.otherProfile, {
            id: userId,
            ...params,
        });
    }
};

export const seeDetailImage = (params: {
    images: Array<string>;
    initIndex?: number;
}) => {
    const {images, initIndex = 0} = params;
    showSwipeImages({
        listImages: images.map(item => ({url: item})),
        initIndex,
        allowSaveImage: true,
    });
};

export const borderWidthTiny = Platform.select({
    ios: moderateScale(0.25),
    android: moderateScale(0.5),
});

export const chosenBlurType: any = Platform.select({
    ios: 'ultraThinMaterialLight',
    android: 'xlight',
});
