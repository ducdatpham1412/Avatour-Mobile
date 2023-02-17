interface TypeChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface TypeGetListBlockedResponse {
  success: boolean;
  data: any;
}

interface TypeChangeInformationRequest {
  email?: string;
  phone?: string;
  gender?: number;
  birthday?: string;
  name?: string;
}

interface TypeChangeInformationResponse {
  success: boolean;
  data: any;
}
