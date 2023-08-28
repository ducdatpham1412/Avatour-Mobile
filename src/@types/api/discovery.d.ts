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

type TypeCreateSale = {
  name: string;
  content: string;
  images: Array<string>;
  prices: Array<TypePrice>;
};

type TypeCreateSaleResponse = TemplateApiResponse<{
  id: number;
}>;

type TypeEditSale = {
  post_id: number;
  data: {
    name?: string;
    content?: string;
    images?: Array<string>;
  };
};

interface TypeJoinPersonal {
  id: number | null;
  sale_id: number;
  amount: number;
  price: number;
  deposit: number;
  creator: number;
  creator_name: string;
  creator_avatar: string;
  created: string;
  group: {
    id: number | null;
    name: string;
    total_members: number;
  };
}

interface TypeJoinEstimate {
  id: number;
  amount: number;
  time_will_buy: string;
  note: string;
  hash: string;
  creator: number;
  creator_name: string;
  created: string;
  expired: string;
  status: number;
  sale: {
    id: number;
    name: string;
    images: string[];
    creator_name: string;
  };
  list_personals: TypeJoinPersonal[];
}

interface TypeMeJoinInSale {
  estimate: TypeJoinEstimate | null;
  joinings: TypeJoinPersonal[];
}

type TypeJoinRequest = {
  amount: number;
  time_will_buy: string;
  note: string;
  saleId: number;
};

type TypeEditEstimate = {
  amount?: number;
  time_will_buy?: string;
  note?: string;
  estimateId: number;
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
  services: number[];
  transports: Array<number>;
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
  status: number;
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

type TypeCreateTour = {
  schedule: number[][];
  input_tour: Pick<
    TourDetail,
    | 'location'
    | 'start_location'
    | 'number_people'
    | 'start_price'
    | 'end_price'
    | 'start_time'
    | 'end_time'
    | 'services'
  >;
};

type TypeCreateTourResponse = {
  tour_id: number;
  status: 'active' | 'draft';
};

type TypeEditTour = Partial<
  Pick<
    TourDetail,
    | 'location'
    | 'start_location'
    | 'number_people'
    | 'start_price'
    | 'end_price'
    | 'services'
    | 'status'
  > & {
    schedule: number[][];
  }
>;

type TypeSearchResponse = TemplateApiResponse<Tour[]>;

type TypeJoinResult = {
  today: TypeJoinEstimate[];
  next: TypeJoinEstimate[];
};
