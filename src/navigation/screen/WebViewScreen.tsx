import {StyleContainer} from 'components/base';
import StyleWebView from 'components/base/StyleWebView';
import {useTheme} from 'hook';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';

type Props = RouteParams<AppParamsList[ROOT_SCREEN.webView]>;

const WebViewScreen = ({route}: Props) => {
  const {title, linkWeb} = route.params;
  const theme = useTheme();

  return (
    <StyleContainer
      headerProps={{
        title,
      }}
      backgroundColor={theme.white}
      customStyle={{paddingHorizontal: 0}}>
      <StyleWebView source={{uri: linkWeb}} />
    </StyleContainer>
  );
};

export default WebViewScreen;
