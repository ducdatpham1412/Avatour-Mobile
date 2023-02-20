import request from './request';

export const apiSavePost = (postId: string) => {
  return request.put(`/profile/save-post/${postId}`);
};

export const apiUnSavePost = (postId: string) => {
  return request.put(`/profile/un-save-post/${postId}`);
};

export const apiLikePost = (param: TypeReactRequest) => {
  return request.put(`/profile/like-post/${param.reactedId}`, {
    type: param.type,
  });
};
export const apiUnLikePost = (params: TypeReactRequest) => {
  return request.put(`/profile/unlike-post/${params.reactedId}`, {
    type: params.type,
  });
};

export const apiGetListGroupBuying = ({params}: TypeParamsPaging) => {
  return request.get(`/profile/list-group-buying/${params.userId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
    },
  });
};

export const apiGetListReviewAboutUser = ({params}: TypeParamsPaging) => {
  return request.get(`/profile/list-posts-review-user/${params.userId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
    },
  });
};

export const apiCreatePurchaseHistory = (body: TypeCreatePurchaseRequest) => {
  return request.post('/profile/create-purchase-history', body);
};

export const apiCreateErrorLog = (error: string) => {
  return request.post('/profile/create-error-log', {
    error,
  });
};

export const apiDeleteGroupBooking = (postId: string) => {
  return request.put(`/profile/delete-group-buying/${postId}`);
};

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
