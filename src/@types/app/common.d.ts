type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type TypeShowModalize<TShow = undefined, THide = undefined, Res = void> = {
  show: (value?: TShow) => Res;
  hide: (value?: THide) => void;
};

type TypeParamsLikePost = {
  postId: number | string;
  isLiked: boolean;
};

interface TypeBubblePalaceAction {
  action: number;
  payload: any;
}

type TypeObjectAny = {
  [key: string]: any;
};
