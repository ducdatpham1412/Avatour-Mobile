import {TYPE_AUTH_REQUEST} from 'asset/enum';

/**
 * Type Get Request User
 */
interface UpgradeAccount {
  name: string;
  location: string;
  phone: string;
  bank_code: string;
  bank_account: string;
}
interface UpdateBank {
  bank_code: string;
  bank_account: string;
}
interface UpdatePrice {
  sale: TypeGroupBuying;
  prices: TypePrice[];
}

export type KeyTypeAuthRequest = keyof typeof TYPE_AUTH_REQUEST;
export interface TypeGetRequestResponse<T extends KeyTypeAuthRequest> {
  id: number;
  type: (typeof TYPE_AUTH_REQUEST)[KeyTypeAuthRequest];
  created: string;
  expired: string;
  data: T extends 'update_price'
    ? UpdatePrice
    : T extends 'update_bank'
    ? UpdateBank
    : T extends 'upgrade_to_shop'
    ? UpgradeAccount
    : T extends 'suggest_location'
    ? TypeGetProfileResponse
    : null;
}
