import {useTheme} from 'hook';
import React from 'react';
import {RefreshControl as BaseRefreshControl} from 'react-native';

interface Props {
  refreshing: boolean;
  onRefresh: () => void;
}

const RefreshControl = ({refreshing, onRefresh}: Props) => {
  const {p_600} = useTheme();

  return (
    <BaseRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={p_600}
      colors={[p_600]}
    />
  );
};

export default RefreshControl;
