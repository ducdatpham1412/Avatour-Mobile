interface TypeEditPriceHistory {
  id: string;
  retailPrice: string;
  prices: Array<TypePrice>;
  created: string;
}

interface TypeReactRequest {
  type: number;
  reactedId: string;
}

type TypeCreateGroupBuying = {
  topic: Array<number>;
  content: string;
  images: Array<string>;
  retailPrice: string;
  prices: Array<TypePrice>;
  isDraft: boolean;
};

type TypePeopleJoinedResponse = {
  id: string;
  deposit: string | null;
  amount: number | null;
  timeWillBuy: string | null;
  note: string | null;
  creator: number;
  creatorName: string;
  creatorAvatar: string;
  creatorPhone: string;
  created: string;
  status: number | null;
  relationship: number | null;
};

type TypeGroupPeopleJoined = {
  id: string;
  totalMembers: number;
  listPeople: Array<TypePeopleJoinedResponse>;
  created: string;
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

type TypeJoinGroupBookingRequest = {
  postId: string;
  money: string;
  amount: number;
  time_will_buy: string;
  note: string;
  is_retail: boolean;
  productId: string;
};

type TypeJoinGbResponse = {
  groupId: string | null;
  joinId: string;
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

interface TourDetail {
  id: number;
  transport: null;
  hotel: null;
  schedule: Array<Array<TypeGetProfileResponse>>;
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
}
