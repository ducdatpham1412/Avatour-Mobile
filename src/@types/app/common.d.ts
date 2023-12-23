type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type TypeShowModalize<TShow = undefined, THide = undefined, Res = void> = {
  show: (value?: TShow) => Res;
  hide: (value?: THide) => void;
};

type TypeObjectAny = {
  [key: string]: any;
};

type TypeNotificationData = {
  link: string;
};

type ZoomImageParams = {
  scale: number;
  translateX: number;
  translateY: number;
};
interface TypeParamsPaging<T = any> {
  params: {
    page_index: number;
    take: number;
  } & T;
  [key: string]: any;
}

type PagingResponse<T = any> = Promise<{
  success: boolean;
  totalPages: number;
  totalItems: number;
  take: number;
  pageIndex: number;
  data: T;
}>;

type ApiResponse<T> = Promise<{
  success: boolean;
  data: T;
}>;
