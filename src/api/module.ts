import {
    TypeBubblePalace,
    TypeChangeChatColor,
    TypeChangeChatName,
    TypeChangeInformationRequest,
    TypeChangeInformationResponse,
    TypeChangePasswordRequest,
    TypeChatMessageResponse,
    TypeChatTagResponse,
    TypeCheckOTPRequest,
    TypeCheckOTPResponse,
    TypeCreateGroupResponse,
    TypeCreatePostRequest,
    TypeEditPostRequest,
    TypeEditProfileRequest,
    TypeEditProfileResponse,
    TypeGetLikePostsResponse,
    TypeGetListBlockedResponse,
    TypeGetPassportResponse,
    TypeGetProfileResponse,
    TypeGroupBuying,
    TypeLoginRequest,
    TypeLoginResponse,
    TypeLoginSocialRequest,
    TypeOpenAccountRequest,
    TypeParamsPaging,
    TypeRegisterReq,
    TypeRegisterRes,
    TypeReportUserRequest,
    TypeRequestOTPRequest,
    TypeRequestOTPResponse,
    TypeResetPasswordRequest,
    TypeResetPasswordResponse,
    TypeResourceResponse,
    TypeUpdateMyBubblesRequest,
} from './interface';
import {TypeGetTopReviewerResponse} from './interface/reputation';
import request from './request';

// OTP
export const apiRequestOTP = (
    params: TypeRequestOTPRequest,
): Promise<TypeRequestOTPResponse> => {
    return request.post('/auth/request-otp', params);
};
export const apiCheckOTP = (
    params: TypeCheckOTPRequest,
): Promise<TypeCheckOTPResponse> => {
    return request.post('/auth/check-otp', params);
};

/**
 *  AUTHENTICATION
 */
export const apiLogin = (
    params: TypeLoginRequest,
): Promise<TypeLoginResponse> => {
    return request.post('/auth/login', params);
};

export const apiLoginSocial = (
    params: TypeLoginSocialRequest,
    tokenSocial?: string | null,
) => {
    return request.post(
        '/auth/login-social',
        params,
        tokenSocial ? {headers: {Authorization: tokenSocial}} : {},
    );
};

export const apiRegister = (
    params: TypeRegisterReq,
): Promise<TypeRegisterRes> => {
    return request.post('/auth/register', params);
};

export const apiResetPassword = (
    params: TypeResetPasswordRequest,
): Promise<TypeResetPasswordResponse> => {
    return request.put('/auth/reset-password', params);
};

export const apiLogOut = (refreshToken: string) => {
    return request.post('/auth/log-out', {
        refreshToken,
    });
};

export const apiGetIdEnjoyMode = () => {
    return request.get('/auth/get-id-enjoy-mode');
};

export const apiLockAccount = () => {
    return request.put('/auth/lock-account');
};

export const apiOpenAccount = (params: TypeOpenAccountRequest) => {
    return request.put('/auth/open-account', params);
};
export const apiRequestDeleteAccount = () => {
    return request.put('auth/delete-account');
};

/**
 *  COMMON
 */
export const apiGetPassport = (): Promise<TypeGetPassportResponse> => {
    return request.get('/common/get-passport');
};

export const apiGetResource = (): Promise<TypeResourceResponse> => {
    return request.get('/common/get-resource');
};

export const apiUploadFile = (params: {
    formData: FormData;
    quality?: number;
    timeout?: number;
}) =>
    request.post('/common/upload-file', params.formData, {
        params: {
            quality: params.quality || undefined,
        },
        timeout: params.timeout || 10000,
    });

export const apiUpdateMyBubbles = (params: TypeUpdateMyBubblesRequest) => {
    return request.put('/common/update-my-bubbles', params.list);
};

export const apiReportUser = (params: {
    userId: number;
    body: TypeReportUserRequest;
}) => {
    return request.post(`/common/report-user/${params.userId}`, params.body);
};

export const apiGetListBubbleActive = ({
    params,
}: TypeParamsPaging): Promise<TypeBubblePalace> => {
    return request.get('/common/get-list-bubble-profile', {
        params,
    });
};

export const apiGetDetailBubble = (
    idBubble: string,
): Promise<{
    success: true;
    data: TypeBubblePalace & TypeGroupBuying;
}> => {
    return request.get(`/common/detail-bubble-profile/${idBubble}`);
};

export const apiGetListComments = ({params}: TypeParamsPaging) => {
    return request.get(`/common/list-comments/${params.postId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
            replied_id: params.replied_id || undefined,
        },
    });
};

export const apiGetListReactsPost = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    data: Array<TypeGetLikePostsResponse>;
}> => {
    return request.get(`/common/list-people-react/${params.idBubble}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
            type: params.type,
        },
    });
};

/**
 *  DISCOVERY and CHAT
 */
export const apiGetListConversations = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    pageIndex: number;
    take: number;
    totalPages: number;
    data: Array<TypeChatTagResponse>;
}> => {
    return request.get('/chat/list-conversations', {
        params,
    });
};

export const apiGetListMessages = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    data: Array<TypeChatMessageResponse>;
}> => {
    return request.get(`/chat/list-messages/${params.chatTagId}`, {
        params,
    });
};

export const apiDeleteMessage = (messageId: string) => {
    return request.put(`/chat/delete-message/${messageId}`);
};

export const apiGetDetailConversation = (conversationId: string) => {
    return request.get(`/chat/detail-conversation/${conversationId}`);
};

export const apiChangeChatColor = (params: TypeChangeChatColor) => {
    return request.put(`/chat/change-chat-color/${params.conversationId}`, {
        color: params.color,
    });
};

export const apiChangeChatName = (params: TypeChangeChatName) => {
    return request.put(`/chat/change-chat-name/${params.conversationId}`, {
        name: params.name,
    });
};

/**
 *  SETTING
 */
export const apiChangeLanguage = (newLanguage: number) => {
    return request.put('/setting/extend/change-language', {
        newLanguage,
    });
};
export const apiChangeTheme = (newTheme: number) => {
    return request.put('/setting/extend/change-theme', {
        newTheme,
    });
};
export const apiChangeDisplayAvatar = (value: boolean) => {
    return request.put('/setting/extend/change-display-avatar', {
        value,
    });
};

export const apiChangePassword = (params: TypeChangePasswordRequest) => {
    return request.put('/setting/security/change-password', params);
};

export const apiBlockUser = (id: number) => {
    return request.post(`/setting/block/${id}`);
};
export const apiUnBlockUser = (id: number) => {
    return request.post(`/setting/unblock/${id}`);
};
export const apiGetListBlocked = (): Promise<TypeGetListBlockedResponse> => {
    return request.get('/setting/block/get-list');
};

export const apiStopConversation = (chatTagId: string) => {
    return request.put(`/setting/stop-conversation/${chatTagId}`);
};
export const apiOpenConversation = (chatTagId: string) => {
    return request.put(`/setting/open-conversation/${chatTagId}`);
};

export const apiChangeInformation = (
    body: TypeChangeInformationRequest,
): Promise<TypeChangeInformationResponse> => {
    return request.put('/setting/change-information', body);
};

/**
 *  PROFILE
 */
export const apiGetProfile = (
    id: number,
): Promise<{
    success: boolean;
    data: TypeGetProfileResponse;
}> => {
    return request.get(`/profile/get-profile/${id}`);
};
export const apiEditProfile = (
    params: TypeEditProfileRequest,
): Promise<TypeEditProfileResponse> => {
    return request.put('/profile/edit-profile', params);
};

export const apiFollowUser = (id: number) => {
    return request.put(`/profile/follow/${id}`);
};
export const apiUnFollowUser = (id: number) => {
    return request.put(`/profile/un-follow/${id}`);
};

export const apiCreatePost = (
    params: TypeCreatePostRequest,
): Promise<{
    success: boolean;
    data: TypeBubblePalace;
}> => {
    return request.post('/profile/create-post', params);
};

export const apiEditPost = (params: {
    idPost: string;
    data: TypeEditPostRequest;
}) => {
    return request.put(`/profile/edit-post/${params.idPost}`, params.data);
};

export const apiEditGroup = (params: {
    idGroup: string;
    data: TypeCreatePostRequest;
}) => {
    return request.put(`/profile/edit-group/${params.idGroup}`, params.data);
};

export const apiCreateGroup = (
    params: TypeCreatePostRequest,
): Promise<{
    success: boolean;
    data: TypeCreateGroupResponse;
}> => {
    return request.post('/profile/create-group', params);
};

export const apiDeletePost = (idPost: string) => {
    return request.put(`/profile/delete-post/${idPost}`);
};

export const apiGetListPostsLiked = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    data: Array<TypeBubblePalace>;
}> => {
    return request.get('/profile/list-posts-liked', {
        params,
    });
};

export const apiGetListPostsSaved = ({
    params,
}: TypeParamsPaging): Promise<{
    success: boolean;
    data: Array<TypeBubblePalace>;
}> => {
    return request.get('/profile/list-posts-saved', {
        params,
    });
};

export const apiGetListPostsArchived = ({params}: TypeParamsPaging) => {
    return request.get('/profile/list-posts-archived', {
        params,
    });
};

export const apiGetListGbJoining = ({params}: TypeParamsPaging) => {
    return request.get('/profile/list-gb-joining', {
        params,
    });
};

export const apiGetListGBJoined = ({params}: TypeParamsPaging) => {
    return request.get('/profile/list-gb-joined', {
        params,
    });
};

export const apiGetListFollow = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/follow/get-list/${params.userId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
            typeFollow: params.typeFollow,
        },
    });
};

// NOTIFICATION
export const apiGetListNotifications = ({params}: TypeParamsPaging) => {
    return request.get('/common/list-notifications', {
        params,
    });
};

export const apiReadNotification = (idNotification: string) => {
    return request.put(`/common/read-notification/${idNotification}`);
};

// REPUTATION
export const apiGetTopReviewers = (): Promise<{
    success: boolean;
    data: TypeGetTopReviewerResponse;
}> => {
    return request.get('/common/get-top-reputations');
};
