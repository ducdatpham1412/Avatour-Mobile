interface TemplateApiResponse<T> {
  success: boolean;
  data: T;
}

type PromiseApiResponse<T> = Promise<{
  success: boolean;
  data: T;
}>;

interface TypeGetPassportResponse {
  success: boolean;
  data: {
    profile: TypeGetProfileResponse & {
      theme: number;
      language: number;
      birthday: string;
      information: {
        facebook: any;
        email: string;
        phone: string;
        bank_account: string;
        bank_code: string;
      };
    };
    numberNewNotifications: number;
  };
}

interface TypePriceResource {
  id: number;
  value: number[];
}
interface TypePurchaseResource {
  product_id: string;
  value: number;
}

interface TypeDeposit {
  deposit: string | null;
  amount: number | null;
  note: string | null;
}

interface TypePersonalJoin {
  id: number | null;
  amount: number;
  creator: number;
  creator_name: string;
  creator_avatar: string;
}

interface TypeGroupJoin {
  id: number | null;
  name: string;
  total_members: number;
  members: TypePersonalJoin[];
  created: string;
}

interface TypePersonalJoinOfAdmin {
  id: number;
  deposit: number;
  price: number;
  amount: number;
  time_will_buy: string;
  note: string;
  creator: number;
  creator_name: string;
  creator_avatar: string;
  created: string;
  status: number;
}

interface TypeGroupBuying {
  id: number;
  post_type: number;
  name: string;
  content: string;
  images: Array<string>;
  prices: Array<TypePrice>;
  total_likes: number;
  total_comments: number;
  total_members: number;
  creator: number;
  creator_name: string;
  creator_avatar: string;
  creator_location: string;
  created: string;
  is_liked: boolean;
  status: number;
}

interface TypeHotLocation {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

interface TypeResourceResponse {
  success: boolean;
  data: {
    background: string;
    gradients: TypeGradient;
    banners: Array<string>;
    favorite_tours: Array<Tour>;
    hot_locations: Array<TypeHotLocation>;
    prices: Array<TypePriceResource>;
    deposit_bank: {
      code: string;
      name: {
        vi: string;
        en: string;
      };
      account_number: string;
      account_holder: string;
    };
  };
}

interface TypeParamsPaging<T = any> {
  params: {
    pageIndex: number;
    take: number;
  } & T;
  [key: string]: any;
}

interface TypePagingResponse<T = any> {
  success: boolean;
  totalPages: number;
  totalItems: number;
  take: number;
  pageIndex: number;
  data: T;
}

interface TypeReportUserRequest {
  reason: number;
  description: string;
  listImages: Array<string>;
}

interface TypeGetLikePostsResponse {
  id: string;
  creator: number;
  creatorName: string;
  creatorAvatar: string;
  created: string;
  relationship: number;
}

type TypeGradient = {
  talking: Array<string>;
  movie: Array<string>;
  technology: Array<string>;
  gaming: Array<string>;
  animal: Array<string>;
  travel: Array<string>;
  fashion: Array<string>;
  other: Array<string>;
};

interface TypeMoreOptionsMe {
  postModal: TypeBubblePalace | TypeGroupBuying;
}
