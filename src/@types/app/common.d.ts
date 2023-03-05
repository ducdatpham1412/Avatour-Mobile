type TypeReduxPassport = Pick<
  TypeGetPassportResponse['data'],
  'profile' | 'information' | 'setting'
>;

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
