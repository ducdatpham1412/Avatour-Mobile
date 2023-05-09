interface TypeEditPriceHistory {
  id: string;
  retailPrice: string;
  prices: Array<TypePrice>;
  created: string;
}

interface TypeReactRequest {
  type: number;
  reactedId: number | string;
}

type TypeCreateGroupBuying = {
  topic: Array<number>;
  content: string;
  images: Array<string>;
  retailPrice: string;
  prices: Array<TypePrice>;
  isDraft: boolean;
};

type TypeMeJoinResponse = {
  id: number;
  sale_id: number;
  group_id: number;
  deposit: number;
  amount: number;
  time_will_buy: string;
  note: string;
  created: string;
  status: number;
  sale: {
    images: string[];
    creator: number;
    name: string;
    avatar: string;
  };
};

type TypeEditGroupBooking = {
  postId: string;
  data: {
    // for update price
    retail_price?: string;
    prices?: Array<TypePrice>;
    // for normal edit
    topic?: Array<number>;
    content?: string;
    status?: number;
    // for reject updating price
    reject_request_update_price?: boolean;
  };
};

type TypeJoinRequest = {
  deposit: number;
  amount: number;
  time_will_buy: string;
  note: string;
  saleId: number;
};

type TypeJoinResponse = {
  group_id: number;
  personal_id: number;
};

interface TypeReactRequest {
  type: number;
  reactedId: string;
}

type TypeItemTopReviewer = {
  id: string;
  creator: number;
  creatorName: string;
  creatorAvatar: string;
  description: string;
  reputation: number;
};

interface TypeGetTopReviewerResponse {
  list: Array<TypeItemTopReviewer>;
  myIndex: number;
}

interface TypeSearchRequest {
  post_search: number;
  location?: string;
  start_location?: string;
  number_people?: number;
  services?: Array<number>;
  transports?: Array<number>;
  start_time?: string; // utc format
  end_time?: string; // utc format
  start_price?: number;
  end_price?: number;
}

type TypeSearchParams = Omit<TypeSearchRequest, 'post_search'>;

interface TourDetail {
  id: number;
  transport: null;
  hotel: null;
  location: string;
  start_location: string;
  number_people: number;
  start_time: string;
  end_time: string;
  start_price: number;
  end_price: number;
  creator: number;
  creator_name: string;
  creator_avatar: string;
  is_liked: boolean;
  schedule: Array<Array<TypeGetProfileResponse>>;
}

type Tour = Pick<
  TourDetail,
  | 'id'
  | 'location'
  | 'number_people'
  | 'start_price'
  | 'end_price'
  | 'creator'
  | 'creator_name'
  | 'creator_avatar'
  | 'is_liked'
> & {
  schedule: string[][];
};

type TypeSearchResponse = TemplateApiResponse<Tour[]>;
