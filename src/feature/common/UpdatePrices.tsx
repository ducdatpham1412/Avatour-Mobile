import {apiEditGroupBooking} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {
    StyleButton,
    StyleIcon,
    StyleText,
    StyleTouchable,
} from 'components/base';
import AddInfoButton from 'feature/profile/components/AddInfoButton';
import ModalAddPrice from 'feature/profile/post/ModalAddPrice';
import ModalRetailPrice from 'feature/profile/post/ModalRetailPrice';
import Redux from 'hook/useRedux';
import {isEqual} from 'lodash';
import StyleHeader from 'navigation/components/StyleHeader';
import {appAlert, goBack} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';

interface Props {
    route: {
        params: {
            item: TypeGroupBuying;
            onUpdatePrice(value: TypeGroupBuying): void;
        };
    };
}

const UpdatePrices = ({route}: Props) => {
    const {onUpdatePrice} = route.params;
    const theme = Redux.getTheme();
    const modalRetailRef = useRef<ModalRetailPrice>(null);
    const modalGroupPriceRef = useRef<ModalAddPrice>(null);
    const [item, setItem] = useState(route.params.item);

    const Notification = () => {
        return (
            <StyleText
                i18Text="alert.ifUpdatePrice"
                customStyle={[
                    styles.notiChangePrice,
                    {color: theme.borderColor},
                ]}
            />
        );
    };

    const onRequestChange = async () => {
        try {
            Redux.setIsLoading(true);
            await apiEditGroupBooking({
                postId: item.id,
                data: {
                    retail_price: item.retailPrice,
                    prices: item.prices,
                },
            });
            onUpdatePrice(item);
            goBack();
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.editGroupBuying,
                payload: {
                    id: item.id,
                    requestUpdatePrice: {
                        retailPrice: item.retailPrice,
                        prices: item.prices,
                    },
                },
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    const onDeletePrice = (valuePrice: string) => {
        const newPrices = item.prices.filter(p => p.value !== valuePrice);
        setItem(preValue => ({
            ...preValue,
            prices: newPrices,
        }));
    };

    const disableButton =
        !item.retailPrice ||
        !item.prices.length ||
        isEqual(
            {
                retailPrice: route.params.item.retailPrice,
                prices: route.params.item.prices,
            },
            {retailPrice: item.retailPrice, prices: item.prices},
        );

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleHeader title="profile.editPrice" />

            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.titleView}>
                        <StyleIcon source={Images.icons.username} size={20} />
                        <StyleText
                            i18Text="discovery.retailPrice"
                            customStyle={[
                                styles.textTitle,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                    <StyleTouchable
                        customStyle={[
                            styles.inputView,
                            {borderColor: theme.borderColor},
                        ]}
                        onPress={() => modalRetailRef.current?.show()}>
                        <StyleText
                            originValue={`${formatLocaleNumber(
                                item.retailPrice,
                            )} vnd`}
                            customStyle={[
                                styles.textRetailPrice,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>

                    <View style={styles.titleView}>
                        <StyleIcon source={Images.icons.dollar} size={20} />
                        <StyleText
                            i18Text="discovery.groupBuyingPrice"
                            customStyle={[
                                styles.textTitle,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </View>
                    {item.prices.map((price, index) => {
                        return (
                            <StyleTouchable
                                key={price.number_people}
                                customStyle={styles.priceBox}
                                onPress={() => {
                                    modalGroupPriceRef.current?.show({
                                        numberPeople: String(
                                            price.number_people,
                                        ),
                                        priceValue: price.value,
                                        indexEdit: index,
                                    });
                                }}>
                                <View
                                    style={[
                                        styles.priceNumberPeople,
                                        {borderColor: theme.borderColor},
                                    ]}>
                                    <StyleText
                                        originValue={price.number_people}
                                        customStyle={[
                                            styles.textNumberPeople,
                                            {color: theme.textColor},
                                        ]}
                                    />
                                </View>
                                <StyleText
                                    originValue="-"
                                    customStyle={[
                                        styles.textMiddle,
                                        {color: theme.borderColor},
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.priceValue,
                                        {borderColor: theme.highlightColor},
                                    ]}>
                                    <StyleText
                                        originValue={`${formatLocaleNumber(
                                            price.value,
                                        )} vnd`}
                                        customStyle={[
                                            styles.textNumberPeople,
                                            {
                                                color: theme.highlightColor,
                                                fontWeight: 'bold',
                                            },
                                        ]}
                                    />
                                </View>

                                <StyleTouchable
                                    customStyle={styles.deleteBox}
                                    hitSlop={10}
                                    onPress={() => onDeletePrice(price.value)}>
                                    <Feather
                                        name="x"
                                        style={[
                                            styles.iconDelete,
                                            {color: theme.borderColor},
                                        ]}
                                    />
                                </StyleTouchable>
                            </StyleTouchable>
                        );
                    })}
                    <AddInfoButton
                        title="profile.addPrice"
                        titleColor={theme.textHightLight}
                        borderColor={theme.borderColor}
                        onPress={() => modalGroupPriceRef.current?.show()}
                    />

                    {Notification()}
                </ScrollView>
            </View>

            <StyleButton
                title="profile.sendRequestChangePrice"
                containerStyle={styles.buttonView}
                onPress={() => onRequestChange()}
                disable={disableButton}
            />

            <ModalRetailPrice
                ref={modalRetailRef}
                theme={theme}
                price={item.retailPrice}
                onChangePrice={newPrice =>
                    setItem(preValue => ({
                        ...preValue,
                        retailPrice: newPrice,
                    }))
                }
            />

            <ModalAddPrice
                ref={modalGroupPriceRef}
                theme={theme}
                prices={item.prices}
                onAddPrice={value =>
                    setItem(preValue => ({
                        ...preValue,
                        prices: preValue.prices.concat(value),
                    }))
                }
                onChangePrice={e => {
                    setItem(preValue => ({
                        ...preValue,
                        prices: preValue.prices.map((price, index) => {
                            if (index !== e.indexEdit) {
                                return price;
                            }
                            return {
                                number_people: e.value.number_people,
                                value: e.value.value,
                            };
                        }),
                    }));
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
        paddingBottom: Metrics.safeBottomPadding,
    },
    contentContainer: {
        paddingHorizontal: '20@s',
    },
    titleView: {
        flexDirection: 'row',
        marginTop: '10@vs',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: FONT_SIZE.normal,
        marginLeft: '5@s',
    },
    inputView: {
        width: '100%',
        marginTop: '10@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        paddingVertical: '5@vs',
        paddingHorizontal: '10@s',
        marginBottom: '10@vs',
    },
    textRetailPrice: {
        fontSize: FONT_SIZE.normal,
    },
    priceBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    priceNumberPeople: {
        flex: 1,
        paddingVertical: '7@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        alignItems: 'center',
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.small,
    },
    textMiddle: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '10@s',
    },
    priceValue: {
        flex: 2,
        paddingVertical: '7@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        paddingHorizontal: '20@s',
    },
    deleteBox: {
        marginLeft: '10@s',
    },
    iconDelete: {
        fontSize: '20@ms',
    },
    // button
    buttonView: {
        paddingVertical: '7@vs',
        width: '80%',
    },
    notiChangePrice: {
        fontSize: FONT_SIZE.small,
        marginTop: '20@vs',
    },
});

export default UpdatePrices;
