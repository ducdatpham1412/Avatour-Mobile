/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect, useRef, useState} from 'react';
import * as RNIap from 'react-native-iap';
import {logger} from './assistant';

interface Params {
    skus: Array<string>;
    onListenerSuccess?(purchase: RNIap.Purchase): void;
    onListenerError?(error: RNIap.PurchaseError): void;
}

const appPurchase = (params: Params) => {
    const {skus, onListenerError, onListenerSuccess} = params;

    const purchaseUpdateSubscription = useRef<any>(null);
    const purchaseErrorSubscription = useRef<any>(null);
    const [isLoading] = useState(false);

    const listenerSuccess = () => {
        purchaseUpdateSubscription.current = RNIap.purchaseUpdatedListener(
            async purchase => {
                onListenerSuccess?.(purchase);
            },
        );
    };

    const listenerError = () => {
        purchaseErrorSubscription.current = RNIap.purchaseErrorListener(
            (error: RNIap.PurchaseError) => {
                onListenerError?.(error);
            },
        );
    };

    const startConnection = async () => {
        try {
            await RNIap.initConnection();
            await RNIap.getProducts({
                skus,
            });
            listenerSuccess();
            listenerError();
        } catch (err) {
            logger('error start connection purchase: ', err);
        }
    };

    const endConnections = async () => {
        try {
            await RNIap.endConnection();
        } catch (err) {
            logger('error end connection purchase: ', err);
        }
    };

    useEffect(() => {
        startConnection();
        return () => {
            if (purchaseUpdateSubscription.current) {
                purchaseUpdateSubscription.current.remove();
                purchaseUpdateSubscription.current = null;
            }
            if (purchaseErrorSubscription.current) {
                purchaseErrorSubscription.current.remove();
                purchaseErrorSubscription.current = null;
            }
            endConnections();
        };
    }, []);

    const requestPurchase = async (idProduct: string) => {
        await RNIap.requestPurchase({
            sku: idProduct,
        });
    };

    return {
        requestPurchase,
        isLoading,
    };
};

export default appPurchase;
