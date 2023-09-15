import {StyleContainer} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';

const NotificationScreen = () => {
  const theme = useTheme();

  return (
    <StyleContainer
      headerProps={{
        title: 'notification.title',
        LeftComponent: null,
      }}
      backgroundColor={theme.white}
    />
  );
};

export default NotificationScreen;
