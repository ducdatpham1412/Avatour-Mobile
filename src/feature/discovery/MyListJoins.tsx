import {verticalMargin} from 'asset/metrics';
import {LoadingScreen, Separator} from 'components';
import {RefreshControl, StyleContainer, StyleList} from 'components/base';
import {InputBox} from 'components/common';
import {useDetailSale} from 'feature/common/hooks';
import {useSafeArea} from 'hook';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {removeVietnameseTones, search} from 'utility/assistant';
import {ItemJoin} from './components';
import {useSaleJoins} from './hooks';

const MyListJoins = ({
  route: {
    params: {saleId},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.myListJoins]>) => {
  const {bottom} = useSafeArea();
  const [{data: sale}] = useDetailSale(saleId, {revalidateAll: false});
  const [
    {data: savedData, loading, validating, loadingConfirmBought},
    {mutate, confirmBought},
  ] = useSaleJoins(saleId);

  const timeOut = useRef<NodeJS.Timeout>();

  const dataSample = useRef<string[]>([]);
  const [data, setData] = useState<TypeJoinEstimate[]>([]);

  useEffect(() => {
    if (savedData) {
      setData(savedData);
      dataSample.current = savedData.map(item =>
        removeVietnameseTones(
          `${item.creator_name}-${item.hash}`.toUpperCase(),
        ),
      );
    }
  }, [savedData]);

  const onConfirmBought = async (estimateId: number) => {
    try {
      await confirmBought({
        list_join_id: [estimateId],
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <>
      <StyleContainer
        initLoading={loading}
        refreshControl={
          <RefreshControl refreshing={validating} onRefresh={mutate} />
        }
        headerProps={{
          title: sale?.name as I18Normalize,
        }}
        layOut="view">
        <InputBox
          style={$input}
          i18Placeholder="discovery.searchNameOrTransactionHash"
          onChangeText={text => {
            clearTimeout(timeOut.current);
            if (savedData) {
              if (text === '') {
                setData(savedData);
                return;
              }

              setTimeout(() => {
                const resIndex = search(dataSample.current, text);
                setData(
                  savedData.filter((_, index) => resIndex.includes(index)),
                );
              }, 100);
            }
          }}
        />

        <StyleList
          data={data}
          renderItem={({item}) => (
            <ItemJoin
              item={item}
              onPressMode="see-detail"
              mode="supplier"
              onConfirmBought={() => onConfirmBought(item.id)}
            />
          )}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{paddingBottom: bottom}}
          refreshing={validating}
          onRefresh={mutate}
          style={$list}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </StyleContainer>

      {loadingConfirmBought && <LoadingScreen />}
    </>
  );
};

const $input: TextStyle = {
  marginTop: verticalMargin,
  width: '100%',
};
const $list: ViewStyle = {
  marginTop: verticalMargin,
};

export default MyListJoins;
