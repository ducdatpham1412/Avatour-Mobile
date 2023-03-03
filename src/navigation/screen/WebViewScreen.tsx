import StyleWebView from 'components/base/StyleWebView';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import StyleHeader from 'navigation/components/StyleHeader';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';

type Props = AppRouteParams<AppParamsList[ROOT_SCREEN.webView]>;

const WebViewScreen = ({route}: Props) => {
  const {title, linkWeb} = route.params;

  return (
    <>
      <ViewSafeTopPadding />
      <StyleHeader title={title || ''} />
      <StyleWebView source={{uri: linkWeb}} />
    </>
  );
};

export default WebViewScreen;
