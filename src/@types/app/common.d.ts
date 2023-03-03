type TypeReduxPassport = Pick<
  TypeGetPassportResponse['data'],
  'profile' | 'information' | 'setting'
>;
