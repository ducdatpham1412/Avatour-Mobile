import {TYPE_AUTH_REQUEST} from 'asset/enum';
import request from './request';

export const apiUpgradeAccount = (body: TypeUpgradeAccount) => {
  return request.put('auth/request', body, {
    params: {
      type: TYPE_AUTH_REQUEST.upgrade_to_shop,
    },
  });
};

export const apiRequestOTP = (
  params: TypeRequestOTPRequest,
): Promise<TypeRequestOTPResponse> => {
  return request.post('/auth/otp', params, {
    timeout: 15000,
  });
};

export const apiCheckOTP = (
  params: TypeCheckOTPRequest,
): Promise<TypeCheckOTPResponse> => {
  return request.put('/auth/otp', params);
};

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
  return request.put(
    '/auth/request',
    {},
    {
      params: {
        type: TYPE_AUTH_REQUEST.lock_account,
      },
    },
  );
};

export const apiOpenAccount = (params: TypeOpenAccountRequest) => {
  return request.get('/auth/request', {
    params: {
      username: params.username,
      code: params.code,
    },
  });
};
export const apiRequestDeleteAccount = () => {
  return request.put(
    'auth/request',
    {},
    {
      params: {
        type: TYPE_AUTH_REQUEST.delete_account,
      },
    },
  );
};

export const apiUpdateBankAccount = (params: TypeUpdateBankAccount) => {
  return request.put(
    'auth/request',
    {
      bank_code: params.bank_code,
      bank_account: params.bank_account,
    },
    {
      params: {
        type: TYPE_AUTH_REQUEST.update_bank,
      },
    },
  );
};

export const apiGetUpdateBank = (): Promise<
  TemplateApiResponse<TypeGetRequestResponse<TypeUpdateBankAccount> | null>
> => {
  return request.post(
    'auth/request',
    {},
    {
      params: {
        type: TYPE_AUTH_REQUEST.update_bank,
      },
    },
  );
};

export const apiGetAllMyRequest = (): Promise<
  TemplateApiResponse<TypeGetRequestResponse<any>[]>
> => {
  return request.post('auth/request', null, {
    params: {type: TYPE_AUTH_REQUEST.all},
  });
};

export const apiDeleteRequest = (requestId: number) => {
  return request.delete('auth/request', {params: {request_id: requestId}});
};

export const apiRequestUpdatePrice = (
  body: TypeRequestUpdatePrice,
): Promise<TemplateApiResponse<TypeRequestResponse>> => {
  return request.put('auth/request', body, {
    params: {
      type: TYPE_AUTH_REQUEST.update_price,
    },
  });
};
