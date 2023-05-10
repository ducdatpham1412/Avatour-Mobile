interface TemplateApiResponse<T> {
  success: boolean;
  data: T;
}

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
  id: number;
  creator: number;
  creator_name: string;
  creator_avatar: string;
}

interface TypeGroupJoin {
  id: number;
  created: string;
  members: TypePersonalJoin[];
}

interface TypePersonalJoinOfAdmin {
  id: number;
  deposit: number;
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
  content: string;
  images: Array<string>;
  prices: Array<TypePrice>;
  total_likes: number;
  total_comments: number;
  total_members: number;
  groups: Array<TypeGroupJoin>;
  creator: number;
  creator_name: string;
  creator_avatar: string;
  creator_location: string;
  created: string;
  is_liked: boolean;
  status: number;
  // check to add request update price in here
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
    // listPurchases: Array<TypePurchaseResource>;
    // topGroupBookings: Array<TypeGroupBuying>;
  };
}

interface TypeParamsPaging<T = any> {
  params: {
    pageIndex: number;
    take: number;
  } & T;
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

interface TypeMoreOptionsMe {
  postModal: TypeBubblePalace | TypeGroupBuying;
}
