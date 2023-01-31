import dynamicLink, {
    FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import FindmeStore from 'app-redux/store';
import {TYPE_DYNAMIC_LINK} from 'asset/enum';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {useEffect} from 'react';
import {logger} from 'utility/assistant';

const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    logger('receive dynamic: ', link);
    const arrayParams = link.url.split('?')[1].split('&');
    const type = Number(arrayParams[0].split('=')[1]);
    const action = arrayParams[1].split('=')[1];

    if (type === TYPE_DYNAMIC_LINK.post) {
        const isModeExp = FindmeStore.getState().accountSlice.modeExp;
        const {token} = FindmeStore.getState().logicSlice;
        const isInApp = isModeExp || token;
        if (isInApp) {
            navigate(ROOT_SCREEN.detailBubble, {
                bubbleId: action,
            });
        } else {
            navigate(LOGIN_ROUTE.loginScreen);
        }
    }
};

const DynamicLink = () => {
    useEffect(() => {
        const unSubscribe = dynamicLink().onLink(handleDynamicLink);
        dynamicLink()
            .getInitialLink()
            .then((link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
                if (link) {
                    handleDynamicLink(link);
                }
            });
        return () => unSubscribe();
    }, []);

    return null;
};

export default DynamicLink;
