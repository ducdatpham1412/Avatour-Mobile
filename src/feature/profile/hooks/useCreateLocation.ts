import useSWRMutation from 'swr/mutation';
import {useState} from 'react';
import {ACCOUNT} from 'asset/enum';
import request from 'api/request';
import useMyLocations from './useMyLocations';

export interface ParamsCreateLocation {
  id?: number;
  avatar: string;
  name: string;
  address: string;
  duration: string;
  typePrice: 'free' | 'paid';
  minCost: string;
  maxCost: string;
  services: number[];
  description: string;
}

const useCreateLocation = (params: ParamsCreateLocation) => {
  const [, {mutate}] = useMyLocations();

  const [avatar, setAvatar] = useState(params.avatar);
  const [name, setName] = useState(params.name);
  const [address, setAddress] = useState(params.address);
  const [typePrice, setTypePrice] = useState(params.typePrice);
  const [duration, setDuration] = useState(params.duration);
  const [minCost, setMinCost] = useState(params.minCost);
  const [maxCost, setMaxCost] = useState(params.maxCost);
  const [services, setServices] = useState(params.services);
  const [description, setDescription] = useState(params.description);

  const {trigger: save, isMutating: loadingSave} = useSWRMutation(
    'api.createEditLocation',
    async () => {
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
      form.append('duration', duration);
      const res = await request.post('/admin/suppliers', form);
      await mutate();
      return res;
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
      setServices,
      setDescription,
      save,
    },
  ] as const;
};

export default useCreateLocation;
