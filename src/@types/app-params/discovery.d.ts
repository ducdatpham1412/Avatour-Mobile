type TypeShowModalCommentOrLike = 'comment' | 'like';

type TypePrice = {
  number_people: number;
  value: string;
};

type TypeSwipeImages = {
  listImages: Array<{url: string}>;
  initIndex?: number;
  allowSaveImage?: boolean;
};
