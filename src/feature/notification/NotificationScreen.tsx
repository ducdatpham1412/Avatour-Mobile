import {FONT_SIZE} from 'asset';
import {ImageEmptyWithDesk} from 'asset/icons';
import {verticalMargin} from 'asset/metrics';
import {StyleContainer, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ViewStyle} from 'react-native';

const NotificationScreen = () => {
  const theme = useTheme();

  return (
    <StyleContainer
      headerProps={{
        title: 'notification.title',
        LeftComponent: null,
      }}
      backgroundColor={theme.white}
      customStyle={$content}
      layOut="view">
      <ImageEmptyWithDesk size={300} />
      <StyleText
        i18Text="notification.notHaveNotifications"
        customStyle={{
          fontSize: FONT_SIZE.f3,
          marginTop: verticalMargin,
          color: theme.gray_500,
        }}
      />
    </StyleContainer>
  );
};

const $content: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};

export default NotificationScreen;
