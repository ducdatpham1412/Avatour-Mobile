import {ItemReview} from 'components';
import React from 'react';
import {View} from 'react-native';

interface Props {
  userId: number;
  account_type: number;
}

const ListReviews = ({}: Props) => {
  return (
    <View>
      <ItemReview />
    </View>
  );
};

export default ListReviews;
