import {safePaddingNotZero} from 'asset/metrics';
import {StyleContainer} from 'components/base';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'utility/scale';
import {ItemJoin} from './components';

const ListJoining = ({
  route: {
    params: {list},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.listJoining]>) => {
  const {bottom} = useSafeAreaInsets();

  return (
    <StyleContainer
      headerProps={{
        title: 'profile.joining',
      }}
      customStyle={{paddingBottom: bottom || safePaddingNotZero}}
      scrollEnabled>
      {list.map(item => {
        return (
          <ItemJoin
            key={item.id}
            item={item}
            containerStyle={$itemContainer}
            bottomComponent="join-status"
            onPressMode="go-from-scan"
          />
        );
      })}
    </StyleContainer>
  );
};

const $itemContainer: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};

export default ListJoining;
