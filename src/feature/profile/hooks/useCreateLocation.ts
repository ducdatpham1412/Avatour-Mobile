import request from 'api/request';
import {ACCOUNT} from 'asset/enum';
import {isEqual} from 'lodash';
import {useState} from 'react';
import useSWRMutation from 'swr/mutation';
import useMyLocations from './useMyLocations';
import useOtherProfile from './useOtherProfile';

export interface ParamsCreateLocation {
  id?: number;
  avatar: string;
  name: string;
  address: string;
  duration: string;
  // price
  typePrice: 'free' | 'paid';
  minCost: string;
  maxCost: string;
  // business time
  typeBusinessTime: 'all-day' | 'limit';
  startTime: number;
  endTime: number;
  // other
  services: number[];
  description: string;
}

const useCreateLocation = (params: ParamsCreateLocation) => {
  const [, {mutate}] = useMyLocations();
  const [, {mutate: mutateProfile}] = useOtherProfile(params?.id ?? null);

  const [avatar, setAvatar] = useState(params.avatar);
  const [name, setName] = useState(params.name);
  const [address, setAddress] = useState(params.address);
  const [duration, setDuration] = useState(params.duration);

  const [typePrice, setTypePrice] = useState(params.typePrice);
  const [minCost, setMinCost] = useState(params.minCost);
  const [maxCost, setMaxCost] = useState(params.maxCost);

  const [typeTime, setTypeTime] = useState(params.typeBusinessTime);
  const [startTime, setStartTime] = useState(params.startTime);
  const [endTime, setEndTime] = useState(params.endTime);

  const [services, setServices] = useState(params.services);
  const [description, setDescription] = useState(params.description);

  const {trigger: save, isMutating: loadingSave} = useSWRMutation(
    'api.createEditLocation',
    async () => {
      /**
       * Create new location
       */
      if (!params.id) {
        const form = new FormData();
        form.append('email', '');
        form.append('phone', '');
        form.append('password', '');
        form.append('account_type', ACCOUNT.location);
        form.append('name', name);
        form.append('description', description);
        form.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar',
        });
        form.append('location', address);
        form.append('lat', 0);
        form.append('lng', 0);
        form.append('services', JSON.stringify(services));
        if (typePrice === 'free') {
          form.append('min_cost', 0);
          form.append('max_cost', 0);
        } else {
          form.append('min_cost', minCost);
          form.append('max_cost', maxCost);
        }
        if (typeTime === 'all-day') {
          form.append('start_time', 0);
          form.append('end_time', 0);
        } else {
          form.append('start_time', startTime);
          form.append('end_time', endTime);
        }
        form.append('duration', duration);

        await request.post('/admin/suppliers', form);
        // TODO: Change this to change in local
        await mutate();
        return 'new-location';
      }

      /**
       * Edit a location
       */
      const form = new FormData();
      if (name !== params.name) {
        form.append('name', name);
      }
      if (description !== params.description) {
        form.append('description', description);
      }
      if (avatar !== params.avatar) {
        form.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar',
        });
      }
      if (address !== params.address) {
        form.append('location', address);
      }

      if (!isEqual(services, params.services)) {
        form.append('services', JSON.stringify(services));
      }

      if (typePrice === 'free') {
        form.append('min_cost', 0);
        form.append('max_cost', 0);
      } else {
        form.append('min_cost', minCost);
        form.append('max_cost', maxCost);
      }

      if (typeTime === 'all-day') {
        form.append('start_time', 0);
        form.append('end_time', 0);
      } else {
        form.append('start_time', startTime);
        form.append('end_time', endTime);
      }

      if (duration !== params.duration) {
        form.append('duration', duration);
      }

      await request.put(`/admin/suppliers/${params.id}`, form, {
        timeout: 30000,
      });
      await mutate();
      await mutateProfile(
        pre => {
          if (pre) {
            return {
              ...pre,
              avatar,
              name,
              description,
              location: address,
              duration: Number(duration),
              min_cost: typePrice === 'free' ? 0 : Number(minCost),
              max_cost: typePrice === 'free' ? 0 : Number(maxCost),
              start_time: typeTime === 'all-day' ? 0 : Number(startTime),
              end_time: typeTime === 'all-day' ? 0 : Number(endTime),
              services,
            };
          }
        },
        {revalidate: false},
      );

      return 'edit-location';
    },
  );

  return [
    {
      avatar,
      name,
      address,
      duration,
      typePrice,
      minCost,
      maxCost,
      typeTime,
      startTime,
      endTime,
      services,
      description,
      loadingSave,
    },
    {
      setAvatar,
      setName,
      setAddress,
      setDuration,
      setTypePrice,
      setMinCost,
      setMaxCost,
      setTypeTime,
      setStartTime,
      setEndTime,
      setServices,
      setDescription,
      save,
    },
  ] as const;
};

export default useCreateLocation;
