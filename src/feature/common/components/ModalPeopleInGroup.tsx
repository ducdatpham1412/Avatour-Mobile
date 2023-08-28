import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {AppModalize, Separator} from 'components';
import {StyleList} from 'components/base';
import {useSafeArea, useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {scale} from 'utility/scale';
import {useJoinInGroup} from '../hooks';
import ItemPersonalJoin from './ItemPersonalJoin';

type TypeShow = {
  groupId: number | null;
  initData?: TypeGroupJoin;
};

interface ListPeopleProps {
  groupId: number;
}

const ListPeople = ({groupId}: ListPeopleProps) => {
  const {bottom} = useSafeArea();
  const [{data, loading, validating}, {mutate}] = useJoinInGroup(groupId);

  return (
    <StyleList
      data={data ?? []}
      renderItem={({item}) => <ItemPersonalJoin item={item} />}
      keyExtractor={item => String(item?.id)}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
      initLoading={loading}
      refreshing={validating}
      onRefresh={mutate}
    />
  );
};

const ModalPeopleInGroup = (
  _: any,
  ref: ForwardedRef<TypeShowModalize<TypeShow>>,
) => {
  const theme = useTheme();
  const {bottom} = useSafeArea();

  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
  const [showData, setShowData] = useState<TypeShow>();
  const [groupName, setGroupName] = useState('');

  useImperativeHandle(
    ref,
    () => ({
      show: value => {
        if (value?.initData?.name) {
          setGroupName(value.initData?.name);
        }
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

    if (showData.initData) {
      return (
        <StyleList
          data={showData.initData.members}
          renderItem={({item}) => <ItemPersonalJoin item={item} />}
          keyExtractor={item => String(item?.id)}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
        />
      );
    }

    if (showData.groupId) {
      return <ListPeople groupId={showData.groupId} />;
    }
  };

  return (
    <AppModalize
      ref={modalRef}
      modalHeight={Metrics.height * 0.8}
      onClosed={() => setShowData(undefined)}
      title={showData ? 'discovery.groupDay' : 'common.null'}
      titleParams={{
        value: groupName,
      }}
      containerStyle={{
        paddingHorizontal: scale(40),
        backgroundColor: theme.background,
      }}>
      {renderContent()}
    </AppModalize>
  );
};

export default forwardRef(ModalPeopleInGroup);
