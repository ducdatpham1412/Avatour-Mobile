import {TOPIC} from 'asset/enum';

export const defaultSearchParams: TypeSearchParams = {
  text_search: '',
  start_location: 'Ha Noi',
  number_people: 4,
  services: [TOPIC.food, TOPIC.backpacking],
  transports: [],
  start_price: 0,
  end_price: 2000000,
};
