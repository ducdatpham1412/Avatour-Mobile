import request from './request';

export const apiUpgradeAccount = (body: TypeUpgradeAccount) => {
  return request.put('auth/upgrade-account', body);
};

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
