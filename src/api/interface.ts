import {TYPE_OS_LOGIN_SOCIAL, TYPE_SOCIAL_LOGIN} from 'asset/enum';
import {TypePrice} from './interface/discovery';

// OTP
export interface TypeRequestOTPRequest {
    username: string;
    typeOTP: number;
    // only for register
    password?: string;
    confirmPassword?: string;
    // targetInfo for both register and changeInfo
    targetInfo?: number;
}
export interface TypeRequestOTPResponse {
    success: boolean;
    data: any;
}
export interface TypeCheckOTPRequest {
    username: string;
    code: string;
}
export interface TypeCheckOTPResponse {
    success: boolean;
    [key: string]: any;
}

/**
 * AUTHENTICATE
 */

// 1. login
export interface TypeLoginRequest {
    username: string;
    password: string;
}
export interface TypeLoginResponse {
    success: boolean;
    data: {
        // for login success
        token?: string;
        refreshToken?: string;
        // for account temporary locking
        username?: number;
        isLocking?: boolean;
    };
    [key: string]: any;
}

export interface TypeOpenAccountRequest {
    username: string;
    verifyCode: any;
}

// Login Social
export interface TypeLoginSocialRequest {
    os: TYPE_OS_LOGIN_SOCIAL;
    provider: TYPE_SOCIAL_LOGIN;
}

// 2. register
export interface TypeRegisterReq {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    code: string;
}
export interface TypeRegisterRes {
    success: boolean;
    data: {
        token: string;
        refreshToken: string;
    };
}

// 3. reset password
export interface TypeResetPasswordRequest {
    username: string;
    newPassword: string;
    confirmPassword: string;
}
export interface TypeResetPasswordResponse {
    success: boolean;
    data: any;
}

/**
 * COMMON
 */
export interface TypeGetPassportResponse {
    success: boolean;
    data: {
        profile: {
            id: number;
            name: string;
            description: string;
            avatar: string;
            cover: string;
            followers: number;
            followings: number;
            listPosts: Array<any>;
        };
        information: {
            facebook: any;
            email: string;
            phone: string;
            gender: any;
            birthday: Date;
        };
        setting: {
            theme: number;
            language: number;
        };
        numberNewNotifications: number;
    };
}

export interface TypeGradient {
    talking: Array<string>;
    movie: Array<string>;
    technology: Array<string>;
    gaming: Array<string>;
    animal: Array<string>;
    travel: Array<string>;
    fashion: Array<string>;
    other: Array<string>;
}

export interface TypeCommentResponse {
    id: string;
    content: string;
    images: Array<string>;
    totalLikes: number;
    totalReplies: number;
    isLiked: number;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string;
}

export interface TypeGetLikePostsResponse {
    id: string;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string;
    relationship: number;
}

export interface TypeSocketCommentRequest {
    token: string;
    comment: {
        postId: string;
        commentReplied: string | null;
        content: string;
        images: Array<string>;
        creatorName: string;
        creatorAvatar: string;
    };
}

export interface TypeSocketCommentResponse {
    commentReplied: string | null;
    data: TypeCommentResponse;
}

/**
 * SETTING
 */
export interface TypeChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface TypeGetListBlockedResponse {
    success: boolean;
    data: any;
}

export interface TypeChangeInformationRequest {
    email?: string;
    phone?: string;
    gender?: number;
    birthday?: string;
    name?: string;
}

export interface TypeChangeInformationResponse {
    success: boolean;
    data: any;
}

/**
 * PROFILE
 */
export interface TypeGetProfileResponse {
    id: number;
    account_type: number;
    name: string;
    location: string;
    anonymousName: string;
    description: string;
    avatar: string;
    cover: string;
    followers: number;
    followings: number;
    reputations: number;
    relationship: number;
}

export interface TypeEditProfileRequest {
    name?: string;
    description?: string;
    avatar?: string;
    cover?: string;
    location?: string;
    bank_code?: string;
    bank_account?: string;
}
export interface TypeEditProfileResponse {
    success: boolean;
    data: any;
}

export interface TypeCreatePostRequest {
    content: string;
    images: Array<string>;
    stars: number;
    topic?: Array<number>;
    feeling?: number | null;
    location?: string | null;
    link?: string | null;
    userId?: number;
    isDraft: boolean;
    // this is only for handle error create post in local
    userReviewed?: {
        id: number;
        name: string;
        avatar: string;
    };
}
export interface TypeEditPostRequest {
    content?: string;
    stars?: number;
    topic?: Array<number>;
    feeling?: number | null;
    location?: string | null;
    link?: string | null;
    isDraft?: boolean;
}

export interface TypeCreateGroupResponse {
    id: string;
    content: string;
    images: Array<string>;
    chatTagId: string;
    creatorId: number;
    createdTime: string;
    color: number;
    name: string;
    relationship: number;
}

export interface TypeGetListPostProfile {
    success: boolean;
    data: Array<TypeBubblePalace>;
}

export interface TypeFollowResponse {
    id: number;
    name: string;
    avatar: string;
    description: string;
    relationship: number;
}

/**
 * DISCOVERY PALACE
 */
export interface TypeBubblePalace {
    id: string;
    postType: number;
    topic: Array<number>;
    feeling: number | null;
    location: string | null;
    link: string | null;
    userReviewed?: {
        id: number;
        name: string;
        avatar: string;
        location: string;
        description: string;
    };
    content: string;
    images: Array<string>;
    stars: number;
    totalLikes: number;
    totalComments: number;
    totalSaved: number;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string;
    isLiked: boolean;
    isSaved: boolean;
    isDraft?: boolean;
    relationship: number;
}

export interface TypeGroupBuying {
    id: string;
    postType: number;
    topic: Array<number>;
    content: string;
    images: Array<string>;
    retailPrice: string;
    prices: Array<TypePrice>;
    deposit: string | null; // string  when status = joining / joined
    amount: number | null; // number when status = joining / joined
    note: string | null;
    totalLikes: number;
    totalComments: number;
    totalGroups: number;
    totalPersonals: number;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    creatorLocation: string;
    created: string;
    isLiked: boolean;
    isDraft: boolean;
    status: number;
    postStatus: number;
    relationship: number;
    // other field follow on situation
    joinId?: string; // in get_list_gb_joining and joined
    requestUpdatePrice: {
        retailPrice: string;
        prices: Array<TypePrice>;
    } | null; // only for apiGetDetail to check is requesting update price
}

export interface TypeBubblePalaceAction {
    action: number;
    payload: any;
}

export interface TypeUpdateMyBubblesRequest {
    list: Array<{
        idHobby: number;
        description: string;
    }>;
}

export interface TypeInteractBubble {
    userId: number;
    name: string;
    avatar: string;
}

/**
 * MESSENGER
 */
export interface TypeConversationRequest {
    content: string;
    userId: number;
}

export interface TypeMemberInListChatTag {
    id: number;
    name: string;
    avatar: string;
    gender: number;
}
export interface TypeChatTagResponse {
    id: string;
    listUser: Array<TypeMemberInListChatTag>;
    conversationName: string;
    conversationImage: string;
    userData: {
        [key: string]: {
            created: string;
            modified: string;
        };
    };
    color: number;
    modified: string;
    status: number;
    isBlocked: boolean;
    latestMessage: string;
    // in front-end
    userTyping?: Array<number>;
}

export interface TypeChatMessageSend {
    conversationId: string;
    type: number;
    content: string | Array<string>;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    tag: string;
    // tag to check message comeback sender after set local message, string Date
}

export interface TypeChatMessageResponse {
    id: string;
    conversationId: string;
    type: number;
    content: string | Array<string>;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string | undefined;
    tag?: string | undefined; // to check message comeback sender after set local message
    // in front-end
    relationship: number;
}

export interface TypeChangeGroupNameResponse {
    conversationId: string;
    name: string;
}

export interface TypeChangeChatColor {
    conversationId: string;
    color: number;
}

export interface TypeChangeChatName {
    conversationId: string;
    name: string;
}

// seen message
export interface TypeSeenMessageResponse {
    conversationId: string;
    data: {
        [key: string]: {
            modified: string;
        };
    };
}

export interface TypeSeenMessageEnjoyResponse {
    chatTagId: string;
    userSeen: any;
}

// bubbles

export interface TypeResourceResponse {
    success: boolean;
    data: {
        imageBackground: string;
        gradients: Array<string>;
        banners: Array<string>;
        hotLocations: Array<any>;
    };
}

// others
export interface TypeParamsPaging {
    params: {
        pageIndex: number;
        take: number;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface TypeReportUserRequest {
    reason: number;
    description: string;
    listImages: Array<string>;
}

export interface TypeDeleteMessageResponse {
    conversationId: string;
    messageId: string;
}

export interface TypingResponse {
    conversationId: string;
    userId: number;
}

/**
 * NOTIFICATION
 */
export interface TypeNotificationResponse {
    id: string;
    type: number;
    image?: string;
    postId?: string;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    created: string;
    isRead: boolean;
}
