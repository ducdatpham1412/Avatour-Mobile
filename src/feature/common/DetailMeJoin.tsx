import {View, Text} from 'react-native';
import React from 'react';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';

const ConfirmJoinScreen = ({
  route: {
    params: {itemJoin},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailMeJoin]>) => {
  return (
    <View>
      <Text>ConfirmJoinScreen</Text>
    </View>
  );
};

export default ConfirmJoinScreen;
