import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, horizontalPadding} from 'asset/metrics';
import {AppModalize, ItemModalProfile, TabView} from 'components';
import {StyleList} from 'components/base';
import {IconTabBar, InputBox} from 'components/common';
import {useApiImmutable, useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useUpdate} from 'react-use';
import {borderWidthTiny} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';

export type TypeShowModalAddLocation = {
  onSave: (value: TypeGetProfileResponse) => void;
  listCurrentIds: number[];
};

const ListLocations = ({onSave, listCurrentIds}: TypeShowModalAddLocation) => {
  const {bottom} = useSafeAreaInsets();
  const {
    data: savedData,
    mutate,
    loading,
    validating,
  } = useApiImmutable<TypeGetProfileResponse[]>({
    path: '/admin/suppliers',
    params: {
      type: ACCOUNT.location,
    },
  });

  const [data, setData] = useState<TypeGetProfileResponse[]>([]);

  useEffect(() => {
    setData(savedData ?? []);
  }, [savedData]);

  return (
    <StyleList
      data={data}
      renderItem={({item}) => {
        if (!listCurrentIds?.includes(item?.id)) {
          return (
            <ItemModalProfile
              profile={item}
              onSelect={() => {
                onSave(item);
                setData(pre => pre.filter(__item => __item?.id !== item?.id));
              }}
            />
          );
        }
        return null;
      }}
      contentContainerStyle={[$content, {paddingBottom: bottom}]}
      initLoading={loading}
      refreshing={validating}
      onRefresh={mutate}
      keyboardDismissMode="on-drag"
    />
  );
};

const ListShops = ({onSave, listCurrentIds}: TypeShowModalAddLocation) => {
  const {bottom} = useSafeAreaInsets();
  const {
    data: savedData,
    mutate,
    loading,
    validating,
  } = useApiImmutable<TypeGetProfileResponse[]>({
    path: '/admin/suppliers',
    params: {
      type: ACCOUNT.shop,
    },
  });

  const [data, setData] = useState<TypeGetProfileResponse[]>([]);

  useEffect(() => {
    setData(savedData ?? []);
  }, [savedData]);

  return (
    <StyleList
      data={data}
      renderItem={({item}) => {
        if (!listCurrentIds?.includes(item?.id)) {
          return (
            <ItemModalProfile
              profile={item}
              onSelect={() => {
                onSave(item);
                setData(pre => pre.filter(__item => __item?.id !== item?.id));
              }}
            />
          );
        }
        return null;
      }}
      contentContainerStyle={[$content, {paddingBottom: bottom}]}
      initLoading={loading}
      refreshing={validating}
      onRefresh={mutate}
      keyboardDismissMode="on-drag"
    />
  );
};

const ModalAddLocation = (
  _: any,
  ref: ForwardedRef<TypeShowModalize<TypeShowModalAddLocation>>,
) => {
  const theme = useTheme();
  const update = useUpdate();

  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
  const onSaveRef = useRef<TypeShowModalAddLocation['onSave']>();
  const listCurrentIds = useRef<number[]>();
  const saveIndexTab = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      show: value => {
        onSaveRef.current = value?.onSave;
        listCurrentIds.current = value?.listCurrentIds;
        update();
        modalRef.current?.show();
      },
      hide: () => modalRef.current?.hide(),
    }),
    [],
  );

  const renderLocations = () => {
    if (onSaveRef.current && listCurrentIds.current) {
      return (
        <ListLocations
          onSave={onSaveRef.current}
          listCurrentIds={listCurrentIds.current}
        />
      );
    }
    return null;
  };

  const renderShops = () => {
    if (onSaveRef.current && listCurrentIds.current) {
      return (
        <ListShops
          onSave={onSaveRef.current}
          listCurrentIds={listCurrentIds.current}
        />
      );
    }
    return null;
  };

  return (
    <AppModalize
      ref={modalRef}
      modalHeight={Metrics.height * 0.8}
      adjustToContentHeight={false}
      containerStyle={$container}
      onClose={() => {
        onSaveRef.current = undefined;
        listCurrentIds.current = undefined;
      }}>
      <InputBox
        style={[$input, {borderColor: theme.gray_600}]}
        i18Placeholder="discovery.searchAround"
      />
      <TabView
        listElements={[renderLocations, renderShops]}
        listIconTabBar={[
          <IconTabBar icon={Images.icons.location} title="profile.location" />,
          <IconTabBar icon={Images.icons.shop} title="profile.shop" />,
        ]}
        style={$body}
        tabBarStyle={$tabBar}
        initialIndex={saveIndexTab.current}
        onChangeIndex={index => {
          saveIndexTab.current = index;
        }}
      />
    </AppModalize>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $input: TextStyle = {
  width: '90%',
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
  borderWidth: borderWidthTiny,
  alignSelf: 'center',
};
const $body: ViewStyle = {
  flex: 1,
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(50),
};
const $content: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: horizontalPadding,
};

export default forwardRef(ModalAddLocation);
