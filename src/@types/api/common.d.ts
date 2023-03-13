interface TypeGetPassportResponse {
  success: boolean;
  data: {
    profile: TypeGetProfileResponse;
    information: {
      facebook: any;
      email: string;
      phone: string;
      gender: any;
      birthday: string;
    };
    setting: {
      theme: number;
      language: number;
      bank_account: string;
      bank_code: string;
    };
    numberNewNotifications: number;
  };
}

interface TypePriceResource {
  id: number;
  value: null | Array<number | string>;
  text: null | string;
}
interface TypePurchaseResource {
  product_id: string;
  value: number;
}
interface TypeGroupBuying {
  id: string;
  postType: number;
  topic: Array<number>;
  content: string;
  images: Array<string>;
  retailPrice: string;
  prices: Array<TypePrice>;
  deposit: string | null; // string  when status = joining / joined
  amount: number | null; // number when status = joining / joined
  note: string | null;
  totalLikes: number;
  totalComments: number;
  totalGroups: number;
  totalPersonals: number;
  creator: number;
  creatorName: string;
  creatorAvatar: string;
  creatorLocation: string;
  created: string;
  isLiked: boolean;
  isDraft: boolean;
  status: number;
  postStatus: number;
  relationship: number;
  // other field follow on situation
  joinId?: string; // in get_list_gb_joining and joined
  requestUpdatePrice: {
    retailPrice: string;
    prices: Array<TypePrice>;
  } | null; // only for apiGetDetail to check is requesting update price
}

interface TypeHotLocation {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

interface TypeFavoriteTour extends Exclude<TourDetail, 'schedule'> {
  schedule: Array<Array<string>>; // array of avatar supplier
}

interface TypeResourceResponse {
  success: boolean;
  data: {
    background: string;
    gradients: TypeGradient;
    banners: Array<string>;
    favorite_tours: Array<TypeFavoriteTour>;
    hot_locations: Array<TypeHotLocation>;
    // listPrices: Array<TypePriceResource>;
    // listPurchases: Array<TypePurchaseResource>;
    // topGroupBookings: Array<TypeGroupBuying>;
  };
}

interface TypeParamsPaging {
  params: {
    pageIndex: number;
    take: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface TypeReportUserRequest {
  reason: number;
  description: string;
  listImages: Array<string>;
}

interface TypeBubblePalace {
  id: string;
  postType: number;
  topic: Array<number>;
  feeling: number | null;
  location: string | null;
  link: string | null;
  userReviewed?: {
    id: number;
    name: string;
    avatar: string;
    location: string;
    description: string;
  };
  content: string;
  images: Array<string>;
  stars: number;
  totalLikes: number;
  totalComments: number;
  totalSaved: number;
  creator: number;
  creatorName: string;
  creatorAvatar: string;
  created: string;
  isLiked: boolean;
  isSaved: boolean;
  isDraft?: boolean;
  relationship: number;
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
