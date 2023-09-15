interface TypeGetProfileResponse {
  id: number;
  account_type: number;
  name: string;
  avatar: string;
  description: string;
  followers: number;
  followings: number;
  gender: number;
  location: string;
  lat: number;
  lng: number;
  min_cost: number;
  max_cost: number;
  duration: number;
  start_time: number;
  end_time: number;
  total_ratings: number;
  average_stars: number;
  services: Array<number>;
  status: number;
  relationship: number;
}

type TypeEditProfileRequest = Partial<
  Pick<
    TypeGetProfileResponse,
    | 'name'
    | 'description'
    | 'avatar'
    | 'location'
    | 'lat'
    | 'lng'
    | 'min_cost'
    | 'max_cost'
    | 'duration'
    | 'start_time'
    | 'end_time'
  > & {
    bank_code: string;
    bank_account: string;
    services: string; // JSON.stringify
  }
>;

interface TypeEditProfileResponse {
  success: boolean;
  data: any;
}

interface TypeCreatePurchaseRequest {
  money: string;
  postId: string;
}

interface TypeCreatePostRequest {
  content: string;
  images: Array<string>;
  stars: number;
  topic?: Array<number>;
  feeling?: number | null;
  location?: string | null;
  link?: string | null;
  userId?: number;
  isDraft: boolean;
  // this is only for handle error create post in local
  userReviewed?: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface TypeEditPostRequest {
  content?: string;
  stars?: number;
  topic?: Array<number>;
  feeling?: number | null;
  location?: string | null;
  link?: string | null;
  isDraft?: boolean;
}

interface TypeRequestBought {
  list_joins_id: number[];
}

interface TypeGetEstimatesAndJoinings {
  estimates: TypeJoinEstimate[];
  joinings: TypeJoinEstimate[];
}

interface TypeFollow {
  id: number;
  name: string;
  avatar: string;
  description: string;
  relationship: number;
}
