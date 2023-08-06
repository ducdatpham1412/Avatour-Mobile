// OTP
interface TypeRequestOTPRequest {
  username: string;
  type_otp: number;
  // only for register
  password?: string;
  confirm_password?: string;
  // only for change information
  new_username?: string;
}

interface TypeRequestOTPResponse {
  success: boolean;
  data: any;
}
interface TypeCheckOTPRequest {
  username: string;
  code: string;
  type?: number;
}
interface TypeCheckOTPResponse {
  success: boolean;
  [key: string]: any;
}

interface TypeLoginRequest {
  username: string;
  password: string;
}
interface TypeLoginResponse {
  success: boolean;
  data: {
    // for login success
    token?: string;
    refreshToken?: string;
  } & {
    // for account temporary locking
    username?: string;
    isLocking?: boolean;
  };
  [key: string]: any;
}

interface TypeItemLoginSuccess {
  username?: string;
  password?: string;
  token: string;
  refreshToken: string;
}

interface TypeLoginSocialRequest {
  os: TYPE_OS_LOGIN_SOCIAL;
  provider: TYPE_SOCIAL_LOGIN;
}

interface TypeRegisterReq {
  username: string;
  password: string;
  confirm_password: string;
  code?: string;
}
interface TypeRegisterRes {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
  };
}

interface TypeResetPasswordRequest {
  username: string;
  password: string;
  confirm_password: string;
  code: string;
}
interface TypeResetPasswordResponse {
  success: boolean;
  data: any;
}

interface TypeOpenAccountRequest {
  username: string;
  code: any;
}

interface TypeUpgradeAccount {
  name: string;
  location: string;
  phone: string;
  bank_code: string;
  bank_account: string;
}

interface TypeUpdateBankAccount {
  bank_code: string;
  bank_account: string;
}

interface TypeGetRequestResponse<T> {
  id: number;
  type: number;
  created: string;
  expired: string;
  data: T;
}

interface TypeRequestUpdatePrice {
  sale_id: number;
  prices: TypePrice[];
}

interface TypeRequestResponse {
  request_id: number;
}
