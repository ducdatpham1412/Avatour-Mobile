import {defaultSWRConfig} from 'hook';
import useSWR from 'swr';

const useVietQRBank = () => {
  const {data, isLoading, isValidating, mutate, error} = useSWR(
    'vietqr.getBanks',
    async () => {
      const resStr = await fetch('https://api.vietqr.io/v2/banks');
      const res = await resStr.json();
      return (res?.data ?? []) as TypeItemBank[];
    },
    defaultSWRConfig,
  );

  return [
    {
      listBanks: data,
      loading: isLoading,
      validating: isValidating,
      error,
    },
    {mutate},
  ] as const;
};

export default useVietQRBank;
