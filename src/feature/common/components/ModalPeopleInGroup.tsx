import {Metrics} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleList} from 'components/base';
import {useApiImmutable, useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {formatDDMMMMYY} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import ItemPersonalJoin from './ItemPersonalJoin';
import ItemPersonalJoinOfAdmin from './ItemPersonalJoinOfAdmin';

type TypeShow = {
  group: TypeGroupJoin;
  isMySale: boolean;
};

interface Props {
  group: TypeGroupJoin;
}

const Separator = () => {
  return <View style={{height: verticalScale(20)}} />;
};

const ListPeople = ({group}: Props) => {
  return (
    <StyleList
      data={group?.members}
      renderItem={({item}) => <ItemPersonalJoin item={item} />}
      keyExtractor={item => String(item?.id)}
      ItemSeparatorComponent={Separator}
    />
  );
};

const ListPeopleOfAdmin = ({group}: Props) => {
  const {data, loading, validating, mutate} = useApiImmutable<
    TypePersonalJoinOfAdmin[]
  >({
    path: 'profile/sales/confirm',
    params: {
      group_id: group.id,
    },
  });

  return (
    <StyleList
      data={data}
      renderItem={({item}) => <ItemPersonalJoinOfAdmin item={item} />}
      keyExtractor={item => String(item?.id)}
      ItemSeparatorComponent={Separator}
      initLoading={loading}
      loading={loading || validating}
      refreshing={validating}
      onRefresh={mutate}
    />
  );
};

const ModalPeopleInGroup = (
  _: any,
  ref: ForwardedRef<TypeShowModalize<TypeShow>>,
) => {
  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
  const [showData, setShowData] = useState<TypeShow>();
  const theme = useTheme();

  useImperativeHandle(
    ref,
    () => ({
      show: value => {
        setShowData(value);
        modalRef.current?.show();
      },
      hide: () => {
        modalRef.current?.hide();
      },
    }),
    [],
  );

  const renderContent = () => {
    if (!showData) {
      return null;
    }
    if (showData.isMySale) {
      return <ListPeopleOfAdmin group={showData.group} />;
    }
    return <ListPeople group={showData.group} />;
  };

  return (
    <AppModalize
      ref={modalRef}
      modalHeight={Metrics.height * 0.8}
      onClosed={() => setShowData(undefined)}
      title={showData ? 'discovery.groupDay' : 'common.null'}
      titleParams={{
        value: showData ? formatDDMMMMYY(showData?.group?.created) : '',
      }}
      containerStyle={{
        paddingHorizontal: showData?.isMySale ? scale(12) : scale(40),
        backgroundColor: theme.background,
      }}>
      {renderContent()}
    </AppModalize>
  );
};

export default forwardRef(ModalPeopleInGroup);
