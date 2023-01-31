import LoadingScreen from 'components/LoadingScreen';
import * as React from 'react';
import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView, WebViewProps} from 'react-native-webview';
import {StyleText} from '.';

const StyleWebView = (props: WebViewProps) => {
    return (
        <View style={styles.container}>
            <WebView
                {...props}
                pullToRefreshEnabled
                startInLoadingState={true}
                renderLoading={() => <LoadingScreen />}
                renderError={errorName => (
                    <View style={styles.flex1}>
                        <StyleText originValue={`Error name: ${errorName}`} />
                        <StyleText
                            customStyle={styles.textPullDown}
                            originValue={'Pull down to try again'}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex1: {
        flex: 1,
    },
    textPullDown: {
        marginTop: 10,
    },
});

export default memo(StyleWebView);
