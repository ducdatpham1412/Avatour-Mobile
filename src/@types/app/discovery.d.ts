type TypeShowModalCommentOrLike = 'comment' | 'like';

type TypePrice = {
  number_people: number;
  price: number;
};

type LibraryImage = {
  local_identifier: string;
  file_name: string;
  url: string | null;
  width: number;
  height: number;
};

type QrData = {
  user_id: number;
  app: 'Avatour';
};
