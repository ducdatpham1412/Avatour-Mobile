import {TypeUpgradeAccount} from './interface/authentication';
import request from './request';

export const apiUpgradeAccount = (body: TypeUpgradeAccount) => {
    return request.put('auth/upgrade-account', body);
};
