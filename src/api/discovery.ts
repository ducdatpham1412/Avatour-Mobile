import {
    TypeCreateGroupBuying,
    TypeEditGroupBooking,
    TypeJoinGbResponse,
    TypeJoinGroupBookingRequest,
} from 'api/interface/discovery';
import {TypeParamsPaging} from './interface';
import request from './request';

export const apiJoinGroupBuying = (
    params: TypeJoinGroupBookingRequest,
): Promise<TypeJoinGbResponse> => {
    return request.put(`/profile/join-group-buying/${params.postId}`, {
        money: params.money,
        amount: params.amount,
        time_will_buy: params.time_will_buy,
        note: params.note,
        is_retail: params.is_retail,
    });
};

export const apiGetListGroupPeopleJoin = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/list-group-joined/${params.postId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
        },
    });
};

export const apiGetListPeopleRetail = ({params}: TypeParamsPaging) => {
    return request.get(`/profile/list-people-retail/${params.postId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
        },
    });
};

export const apiConfirmUserBought = (join_id: string) => {
    return request.put(`profile/confirm-user-bought/${join_id}`);
};

export const apiCreateGroupBuying = (body: TypeCreateGroupBuying) => {
    return request.post('profile/create-group-buying', body);
};

export const apiEditGroupBooking = (body: TypeEditGroupBooking) => {
    return request.put(`profile/edit-group-buying/${body.postId}`, body.data);
};

export const apiGetListEditHistory = ({params}: TypeParamsPaging) => {
    return request.get(`/common/list-edit-history/${params.postId}`, {
        params: {
            pageIndex: params.pageIndex,
            take: params.take,
        },
    });
};
