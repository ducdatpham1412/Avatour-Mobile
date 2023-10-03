import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, horizontalPadding} from 'asset/metrics';
import {
  AppModalize,
  ItemModalProfile,
  LoadingScreen,
  Separator,
  TabView,
  TabViewProps,
} from 'components';
import {StyleList, StyleText, StyleTouchable} from 'components/base';
import {IconTabBar, InputBox} from 'components/common';
import {useMyLocations} from 'feature/profile/hooks';
import {useApi, useSafeArea, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdate} from 'react-use';
import {removeVietnameseTones, search} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import Toast from './Toast';
import {useContextCreateTour} from 'feature/profile/CreateTour';
import ModalAlert from './ModalAlert';

export type TypeShowModalAddLocation = {
  onSelect: (value: TypeGetProfileResponse) => void;
  onDelete: (value: TypeGetProfileResponse) => void;
};

type ListLocationsProps = TypeShowModalAddLocation & {
  type: number | 'my-location';
};

let timeOut: NodeJS.Timeout;

const ListLocations = ({onSelect, onDelete, type}: ListLocationsProps) => {
  const {paddingBottom} = useSafeArea();
  const {t} = useTranslation();
  const theme = useTheme();

  const {
    data: savedData,
    mutate,
    loading,
    validating,
  } = useApi<TypeGetProfileResponse[]>({
    path: '/admin/suppliers',
    params: {
      type,
    },
  });
  const [{schedules}] = useContextCreateTour();

  const savedUpperCaseName = useRef<string[]>([]);
  const emptyText = useRef('');
  const [data, setData] = useState<TypeGetProfileResponse[]>([]);

  useEffect(() => {
    if (savedData) {
      setData(savedData);
      savedUpperCaseName.current = savedData.map(location =>
        removeVietnameseTones(location.name.toUpperCase()),
      );
    }
  }, [savedData]);

  const renderEmpty = () => {
    return (
      <View style={$emptyView}>
        <StyleText i18Text="profile.noFoundLocation" />
        <StyleTouchable
          customStyle={$empty}
          onPress={() =>
            navigate(ROOT_SCREEN.createLocation, {
              itemNew: {
                name: emptyText.current,
              },
            })
          }>
          <AntDesign
            name="plus"
            style={{
              fontSize: moderateScale(16),
              color: theme.blue,
            }}
          />
          <StyleText
            originValue={`${t('discovery.addLocation')} "${emptyText.current}"`}
            customStyle={[$textAddLocation, {color: theme.blue}]}
          />
        </StyleTouchable>
      </View>
    );
  };

  const renderFooter = () => {
    if (type === 'my-location') {
      return (
        <StyleTouchable
          customStyle={[$empty, {marginLeft: scale(8)}]}
          onPress={() =>
            navigate(ROOT_SCREEN.createLocation, {
              itemNew: {
                name: emptyText.current,
              },
            })
          }>
          <AntDesign
            name="plus"
            style={{
              fontSize: moderateScale(16),
              color: theme.blue,
            }}
          />
          <StyleText
            i18Text="discovery.addLocation"
            customStyle={[$textAddLocation, {color: theme.blue}]}
          />
        </StyleTouchable>
      );
    }

    return null;
  };

  return (
    <>
      <InputBox
        style={[$input, {backgroundColor: theme.gray_100}]}
        i18Placeholder="common.search"
        onChangeText={text => {
          clearTimeout(timeOut);

          if (savedData) {
            if (text === '') {
              setData(savedData);
              return;
            }
            emptyText.current = text;

            timeOut = setTimeout(() => {
              const resIndex = search(savedUpperCaseName.current, text);
              setData(savedData.filter((_, index) => resIndex.includes(index)));
            }, 100);
          }
        }}
      />
      <StyleList
        data={data}
        renderItem={({item}) => {
          let isChosen = false;
          schedules.every(day => {
            isChosen = !!day?.find(location => location.id === item?.id);
            return !isChosen;
          });

          return (
            <ItemModalProfile
              profile={item}
              onSelect={() => {
                const agree = () => {
                  onSelect(item);
                  Toast.show({
                    title: 'common.add',
                    content: item.name,
                  });
                };
                if (isChosen) {
                  ModalAlert.options({
                    content: t('alert.locationHadBeenAdded', {
                      value: item.name,
                    }),
                    onContinue: agree,
                  });
                } else {
                  agree();
                }
              }}
              onDelete={() => {
                onDelete(item);
                Toast.show({
                  title: 'common.deleted',
                  content: item.name,
                });
              }}
              isChosen={isChosen}
            />
          );
        }}
        contentContainerStyle={[$content, {paddingBottom}]}
        initLoading={loading}
        refreshing={validating}
        onRefresh={mutate}
        ListEmptyComponent={renderEmpty()}
        ListFooterComponent={renderFooter()}
        ItemSeparatorComponent={Separator}
      />
    </>
  );
};

const ModalAddLocation = (
  _: any,
  ref: ForwardedRef<TypeShowModalize<TypeShowModalAddLocation>>,
) => {
  const update = useUpdate();
  const theme = useTheme();

  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
  const onSelectRef = useRef<TypeShowModalAddLocation['onSelect']>();
  const onDeleteRef = useRef<TypeShowModalAddLocation['onDelete']>();
  const saveIndexTab = useRef(0);

  const [{data: myLocations, loading}] = useMyLocations();

  useImperativeHandle(
    ref,
    () => ({
      show: value => {
        onSelectRef.current = value?.onSelect;
        onDeleteRef.current = value?.onDelete;
        update();
        modalRef.current?.show();
      },
      hide: () => modalRef.current?.hide(),
    }),
    [],
  );

  const renderLocations = () => {
    if (onSelectRef.current && onDeleteRef.current) {
      return (
        <ListLocations
          onSelect={onSelectRef.current}
          onDelete={onDeleteRef.current}
          type={ACCOUNT.location}
        />
      );
    }
    return null;
  };

  const renderShops = () => {
    if (onSelectRef.current && onDeleteRef.current) {
      return (
        <ListLocations
          onSelect={onSelectRef.current}
          onDelete={onDeleteRef.current}
          type={ACCOUNT.shop}
        />
      );
    }
    return null;
  };

  const renderMyLocations = () => {
    if (onSelectRef.current && onDeleteRef.current) {
      return (
        <ListLocations
          onSelect={onSelectRef.current}
          onDelete={onDeleteRef.current}
          type="my-location"
        />
      );
    }
    return null;
  };

  const content = () => {
    if (loading) {
      return <LoadingScreen />;
    }

    const listElements: TabViewProps['listElements'] = myLocations?.length
      ? [renderLocations, renderShops, renderMyLocations]
      : [renderLocations, renderShops];
    const tabBars: TabViewProps['listIconTabBar'] = myLocations?.length
      ? [
          <IconTabBar
            icon={Images.icons.location}
            title="profile.location"
            titleStyle={$title}
          />,
          <IconTabBar
            icon={Images.icons.shop}
            title="profile.shop"
            titleStyle={$title}
          />,
          <IconTabBar
            icon={Images.icons.profile}
            title="profile.personal"
            titleStyle={$title}
          />,
        ]
      : [
          <IconTabBar
            icon={Images.icons.location}
            title="profile.location"
            titleStyle={$title}
          />,
          <IconTabBar
            icon={Images.icons.shop}
            title="profile.shop"
            titleStyle={$title}
          />,
        ];

    return (
      <>
        <TabView
          listElements={listElements}
          listIconTabBar={tabBars}
          style={$body}
          initialIndex={saveIndexTab.current}
          onChangeIndex={index => {
            saveIndexTab.current = index;
          }}
          tabBarType="scroll"
          tabBarStyle={$tabBar}
          tabBarElementScrollWidth={moderateScale(120)}
          tabBarElementBackground={theme.gray_100}
        />
      </>
    );
  };

  return (
    <AppModalize
      ref={modalRef}
      modalHeight={Metrics.height * 0.9}
      adjustToContentHeight={false}
      containerStyle={$container}
      onClose={() => {
        onSelectRef.current = undefined;
        onDeleteRef.current = undefined;
      }}>
      {content()}
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
  alignSelf: 'center',
  marginBottom: verticalScale(12),
};
const $body: ViewStyle = {
  flex: 1,
};
const $content: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: horizontalPadding,
};
const $tabBar: ViewStyle = {
  paddingTop: verticalScale(4),
  paddingBottom: verticalScale(12),
  paddingHorizontal: scale(8),
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f2,
};
const $empty: ViewStyle = {
  marginTop: verticalScale(12),
  flexDirection: 'row',
  alignItems: 'center',
};
const $emptyView: ViewStyle = {
  paddingHorizontal: scale(8),
  marginBottom: verticalScale(12),
};
const $textAddLocation: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginLeft: scale(4),
};

export default forwardRef(ModalAddLocation);
