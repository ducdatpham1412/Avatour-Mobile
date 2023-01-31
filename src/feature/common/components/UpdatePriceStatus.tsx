/* eslint-disable react-hooks/rules-of-hooks */
import {apiEditGroupBooking} from 'api/discovery';
import {TypePrice} from 'api/interface/discovery';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';

interface Props {
    postId: string;
    retailPrice: string;
    prices: Array<TypePrice>;
}

const UpdatePriceStatus = (props: Props) => {
    const {postId, retailPrice, prices} = props;
    const theme = Redux.getTheme();

    const onCancelRequesting = async () => {
        try {
            Redux.setIsLoading(true);
            await apiEditGroupBooking({
                postId,
                data: {
                    reject_request_update_price: true,
                },
            });
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.editGroupBuying,
                payload: {
                    id: postId,
                    requestUpdatePrice: null,
                },
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <View
            style={[
                styles.requestUpdatePriceView,
                {borderColor: theme.borderColor},
            ]}>
            <StyleText
                i18Text="discovery.reviewUpdatePrice"
                customStyle={[
                    styles.textReviewingPrice,
                    {color: theme.borderColor},
                ]}
            />
            <StyleText
                i18Text="discovery.retailPrice"
                customStyle={[
                    styles.textUpdatePrice,
                    {color: theme.borderColor},
                ]}>
                <StyleText
                    originValue={`: ${retailPrice}`}
                    customStyle={[
                        styles.textUpdatePrice,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleText>

            <StyleText
                i18Text="discovery.groupBuyingPrice"
                customStyle={[
                    styles.textUpdatePrice,
                    {color: theme.borderColor},
                ]}>
                <StyleText
                    originValue=":"
                    customStyle={[
                        styles.textUpdatePrice,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleText>
            {prices.map(p => (
                <View key={p.value} style={styles.updatePriceBox}>
                    <StyleText
                        i18Text="discovery.numberPeople"
                        i18Params={{
                            value: p.number_people,
                        }}
                        customStyle={[
                            styles.peoplePriceText,
                            {
                                width: '32%',
                                color: theme.borderColor,
                            },
                        ]}
                    />
                    <StyleText
                        originValue="-"
                        customStyle={[
                            styles.peoplePriceText,
                            {
                                color: theme.borderColor,
                                marginRight: '12%',
                            },
                        ]}
                    />
                    <StyleText
                        originValue={`${formatLocaleNumber(p.value)} vnd`}
                        style={[
                            styles.peoplePriceText,
                            {color: theme.borderColor},
                        ]}
                    />
                </View>
            ))}

            <StyleTouchable
                customStyle={[
                    styles.buttonBox,
                    {borderColor: theme.holderColorLighter},
                ]}
                onPress={() => onCancelRequesting()}>
                <StyleText
                    i18Text="discovery.cancelRequest"
                    customStyle={[
                        styles.textCancel,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    requestUpdatePriceView: {
        width: '80%',
        paddingHorizontal: '15@s',
        paddingVertical: '5@vs',
        borderWidth: borderWidthTiny,
        marginTop: '10@vs',
        alignSelf: 'center',
        borderRadius: '5@ms',
    },
    textReviewingPrice: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
    textUpdatePrice: {
        fontSize: FONT_SIZE.small,
    },
    updatePriceBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    peoplePriceText: {
        fontSize: FONT_SIZE.small,
    },
    buttonBox: {
        marginTop: '10@vs',
        borderWidth: borderWidthTiny,
        alignItems: 'center',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    textCancel: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
});

export default UpdatePriceStatus;
