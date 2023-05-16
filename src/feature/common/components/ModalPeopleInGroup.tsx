import {apiConfirmUserBought} from 'api/discovery';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleList} from 'components/base';
import {useApiImmutable, useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {formatDDMMMMYY} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import ItemPersonalJoin from './ItemPersonalJoin';
import ItemPersonalJoinOfAdmin, {
  TypeConfirmBought,
} from './ItemPersonalJoinOfAdmin';

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
  const {bottom} = useSafeAreaInsets();
  return (
    <StyleList
      data={group?.members}
      renderItem={({item}) => <ItemPersonalJoin item={item} />}
      keyExtractor={item => String(item?.id)}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
    />
  );
};

const ListPeopleOfAdmin = ({group}: Props) => {
  const {bottom} = useSafeAreaInsets();
  const {data, loading, validating, mutate} = useApiImmutable<
    TypePersonalJoinOfAdmin[]
  >({
    path: 'profile/sales/confirm',
    params: {
      group_id: group.id,
    },
  });

  const onConfirmBought: TypeConfirmBought = async (
    list_joins_id,
    {setLoading},
  ) => {
    try {
      setLoading(true);
      await apiConfirmUserBought(list_joins_id);
      await mutate(pre => {
        if (pre) {
          return pre.map(join => {
            if (list_joins_id.includes(join?.id)) {
              return {
                ...join,
                status: GROUP_BUYING_STATUS.bought,
              };
            }
            return join;
          });
        }
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleList
      data={data ?? []}
      renderItem={({item}) => (
        <ItemPersonalJoinOfAdmin
          item={item}
          onConfirmBought={onConfirmBought}
        />
      )}
      keyExtractor={item => String(item?.id)}
      ItemSeparatorComponent={Separator}
      initLoading={loading}
      loading={loading || validating}
      refreshing={validating}
      onRefresh={mutate}
      contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
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
