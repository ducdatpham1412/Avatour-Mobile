import {View, Text} from 'react-native';
import React from 'react';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';

const ScanResult = ({
  route: {
    params: {mode},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.scanResult]>) => {
  return (
    <View>
      <Text>ScanResult</Text>
    </View>
  );
};

export default ScanResult;
