import {TOPIC} from 'asset/enum';

export const defaultSearchParams: TypeSearchParams = {
  location: 'Ha Noi',
  start_location: 'Ha Noi',
  number_people: 4,
  services: [TOPIC.food, TOPIC.volunteer],
  transports: [],
  start_price: 0,
  end_price: 2000000,
};
