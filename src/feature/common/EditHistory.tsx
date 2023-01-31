import {apiGetListEditHistory} from 'api/discovery';
import {TypeEditPriceHistory} from 'api/interface/discovery';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {formatDayGroupBuying, formatLocaleNumber} from 'utility/format';

interface Props {
    route: {
        params: {
            postId: string;
        };
    };
}

const EditHistory = ({route}: Props) => {
    const {postId} = route.params;
    const theme = Redux.getTheme();

    const {list, refreshing, onRefresh, onLoadMore} = usePaging({
        request: apiGetListEditHistory,
        params: {
            postId,
        },
    });

    const RenderItem = useCallback(
        (item: TypeEditPriceHistory) => {
            return (
                <View
                    style={[
                        styles.itemContainer,
                        {borderColor: theme.borderColor},
                    ]}>
                    <StyleText
                        originValue={formatDayGroupBuying(item.created)}
                        customStyle={[
                            styles.textDatetime,
                            {color: theme.borderColor},
                        ]}
                    />
                    <StyleText
                        i18Text="discovery.retailPrice"
                        customStyle={[
                            styles.textRetail,
                            {color: theme.textHightLight},
                        ]}>
                        <StyleText
                            originValue={`: ${formatLocaleNumber(
                                item.retailPrice,
                            )}vnd`}
                            customStyle={[
                                styles.textRetail,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleText>
                    <StyleText
                        i18Text="discovery.groupBuyingPrice"
                        customStyle={[
                            styles.textRetail,
                            {color: theme.textHightLight},
                        ]}>
                        <StyleText
                            originValue=":"
                            customStyle={[
                                styles.textRetail,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleText>
                    {item.prices.map(price => {
                        return (
                            <View
                                key={String(price.number_people)}
                                style={styles.groupPriceBox}>
                                <StyleText
                                    originValue={price.number_people}
                                    customStyle={[
                                        styles.textNumberPeople,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                                <StyleText
                                    originValue="-"
                                    customStyle={[
                                        styles.textMiddle,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                                <StyleText
                                    originValue={`${formatLocaleNumber(
                                        price.value,
                                    )}vnd`}
                                    customStyle={[
                                        styles.textPrice,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            </View>
                        );
                    })}
                </View>
            );
        },
        [theme.backgroundColor],
    );

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleHeader title="discovery.historyEdit" />
            <StyleList
                data={list}
                renderItem={({item}) => RenderItem(item)}
                keyExtractor={item => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                contentContainerStyle={{
                    alignItems: 'center',
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    itemContainer: {
        width: Metrics.width * 0.9,
        paddingHorizontal: '10@s',
        paddingVertical: '8@s',
        marginTop: '5@vs',
        marginBottom: '10@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
    },
    textDatetime: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    textRetail: {
        fontSize: FONT_SIZE.small,
        marginTop: '3@vs',
    },
    groupPriceBox: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '1@vs',
        alignSelf: 'center',
    },
    textNumberPeople: {
        fontSize: FONT_SIZE.small,
        width: '20%',
    },
    textMiddle: {
        fontSize: FONT_SIZE.small,
        width: '10%',
    },
    textPrice: {
        fontSize: FONT_SIZE.small,
        width: '70%',
    },
});

export default EditHistory;
