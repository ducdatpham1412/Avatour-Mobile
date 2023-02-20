// OTP
interface TypeRequestOTPRequest {
  username: string;
  typeOTP: number;
  // only for register
  password?: string;
  confirmPassword?: string;
  // targetInfo for both register and changeInfo
  targetInfo?: number;
}

interface TypeRequestOTPResponse {
  success: boolean;
  data: any;
}
interface TypeCheckOTPRequest {
  username: string;
  code: string;
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
    // for account temporary locking
    username?: number;
    isLocking?: boolean;
  };
  [key: string]: any;
}

interface TypeLoginSocialRequest {
  os: TYPE_OS_LOGIN_SOCIAL;
  provider: TYPE_SOCIAL_LOGIN;
}

interface TypeRegisterReq {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  code: string;
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
  newPassword: string;
  confirmPassword: string;
}
interface TypeResetPasswordResponse {
  success: boolean;
  data: any;
}

interface TypeOpenAccountRequest {
  username: string;
  verifyCode: any;
}

interface TypeUpgradeAccount {
  location: string;
  phone: string;
  bankCode: string;
  bankAccount: string;
}
