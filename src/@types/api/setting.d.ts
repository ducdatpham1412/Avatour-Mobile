interface TypeChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface TypeBlock {
  id: number;
  profile: {
    id: number;
    avatar: string;
    name: string;
  };
}

interface TypeChangeInformationRequest {
  username?: string;
  gender?: number;
  birthday?: string;
  name?: string;
  // code is otp when change username (email / phone)
  code?: string;
}

interface TypeChangeInformationResponse {
  success: boolean;
  data: any;
}
