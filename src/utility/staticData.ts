import {TOPIC} from 'asset/enum';
import {I18Normalize} from './I18Next';
import {ParamsCreateLocation} from 'feature/profile/hooks';

export const defaultSearchParams: TypeSearchParams = {
  text_search: '',
  start_location: 'Ha Noi',
  number_people: 4,
  services: [TOPIC.food, TOPIC.backpacking],
  transports: [],
  start_price: 0,
  end_price: 2000000,
};

export type TypeLocationPrice = ParamsCreateLocation['typePrice'];
export const listOptionsPrice: Array<{
  id: TypeLocationPrice;
  text: I18Normalize;
}> = [
  {
    id: 'free',
    text: 'discovery.free',
  },
  {
    id: 'paid',
    text: 'discovery.paid',
  },
];

export type TypeBusinessTime = ParamsCreateLocation['typeBusinessTime'];
export const listOptionsBusinessTime: Array<{
  id: TypeBusinessTime;
  text: I18Normalize;
}> = [
  {
    id: 'all-day',
    text: 'profile.openAllDay',
  },
  {
    id: 'limit',
    text: 'profile.openLimit',
  },
];
