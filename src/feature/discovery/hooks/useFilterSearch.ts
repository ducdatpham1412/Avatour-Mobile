import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_TYPE} from 'asset/enum';
import {useState} from 'react';
import isEqual from 'react-fast-compare';
import {useAsync} from 'react-use';
import AppAsyncStorage from 'utility/asyncStore';
import {OptionTickBox} from '../components';

interface Params {
  onChangeSearch: (value: TypeSearchParams) => void;
  initSearchParams: TypeSearchParams;
}

const useFilterSearch = ({onChangeSearch, initSearchParams}: Params) => {
  const [searchParams, setSearchParams] =
    useState<TypeSearchParams>(initSearchParams);

  useAsync(async () => {
    const res = await AppAsyncStorage.getSearchParams();
    if (isEqual(searchParams, {})) {
      onChangeSearch(res);
      setSearchParams(res);
    } else {
      const newSearchParams = {
        ...res,
        ...searchParams,
      };
      onChangeSearch(newSearchParams);
      setSearchParams(newSearchParams);
      await AsyncStorage.setItem(
        ASYNC_TYPE.searchParams,
        JSON.stringify(newSearchParams),
      );
    }
  }, []);

  const onPressVehicle = (value: OptionTickBox) => {
    const included = !!searchParams?.transports?.find(id => id === value?.id);
    if (included) {
      setSearchParams(pre => ({
        ...pre,
        transports: pre?.transports?.filter(id => id !== value.id),
      }));
    } else {
      setSearchParams(pre => ({
        ...pre,
        transports: pre?.transports?.concat(value.id),
      }));
    }
  };

  const onPressService = (value: OptionTickBox) => {
    const included = !!searchParams.services?.find(id => id === value.id);
    if (included) {
      if (searchParams?.services && searchParams?.services?.length > 1) {
        setSearchParams(pre => ({
          ...pre,
          services: pre?.services?.filter(id => id !== value.id),
        }));
      }
    } else {
      setSearchParams(pre => ({
        ...pre,
        services: pre?.services?.concat(value.id),
      }));
    }
  };

  const onChangeNumberPeople = (value: number) => {
    if (!searchParams?.number_people) {
      return;
    }
    const nextValue = searchParams.number_people + value;
    if (nextValue <= 0) {
      return;
    }
    setSearchParams(pre => ({
      ...pre,
      number_people: nextValue,
    }));
  };

  const onSavePrice = (start: number, end: number) => {
    setSearchParams(pre => ({
      ...pre,
      start_price: start,
      end_price: end,
    }));
  };

  return {
    searchParams,
    setSearchParams,
    actions: {
      onPressVehicle,
      onPressService,
      onChangeNumberPeople,
      onSavePrice,
    },
  };
};

export default useFilterSearch;
