import {setSearchParams} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import {TabView} from 'components';
import {SafeView, StyleIcon, StyleTouchable} from 'components/base';
import AppInput from 'components/base/AppInput';
import {IconTabBar} from 'components/common';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {TextInput, TextStyle, View, ViewStyle} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useUpdateEffect} from 'react-use';
import {borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalSearchFilter, ToolSearch} from './components';
import SearchSuggestions from './components/SearchSuggestions';
import {SearchListGroupBuying, SearchListTour} from './screens';

const SearchScreen = ({
  route,
}: RouteParams<AppParamsList[DISCOVERY_ROUTE.searchScreen]>) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {searchParams} = useAppSelector(state => state.logicSlice);

  const servicesRoute = useRef(route.params?.services).current;
  const searchRoute = useRef(route.params?.search);
  const isRouteParamsNull = useRef(
    servicesRoute === undefined && searchRoute.current === undefined,
  );
  const initSearchParams = useRef(
    servicesRoute ? {services: [servicesRoute]} : {},
  );

  const modalFilterRef = useRef<ElementRef<typeof ModalSearchFilter>>(null);
  const inputRef = useRef<TextInput>(null);
  const checkHaveInitSearchParams = useRef(false);

  const [displayHint, setDisplayHint] = useState(isRouteParamsNull.current);
  const [showResult, setShowResult] = useState(!isRouteParamsNull.current);

  const [location, setLocation] = useState(searchRoute.current || '');

  useEffect(() => {
    if (isRouteParamsNull.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, []);

  useUpdateEffect(() => {
    if (!isEqual(searchParams, {})) {
      if (isRouteParamsNull.current && checkHaveInitSearchParams.current) {
        setShowResult(true);
      } else {
        checkHaveInitSearchParams.current = true;
      }
      setDisplayHint(false);
    }
  }, [searchParams]);

  const SearchBox = (
    <View style={[$searchView, {borderBottomColor: theme.gray_200}]}>
      <StyleTouchable customStyle={$backView} onPress={goBack}>
        <Ionicons
          name="arrow-back"
          style={[$iconBack, {color: theme.gray_500}]}
        />
      </StyleTouchable>
      <AppInput
        ref={inputRef}
        style={[$input, {color: theme.black}]}
        placeholder={t('discovery.searchAround')}
        onChangeText={text => setLocation(text)}
        defaultValue={searchRoute.current}
        returnKeyType="search"
        onSubmitEditing={() => {
          setSearchParams({...searchParams, location});
        }}
        placeholderTextColor={theme.gray_500}
        onFocus={() => setDisplayHint(true)}
        onBlur={() => {
          if (showResult) {
            setDisplayHint(false);
          }
        }}
      />
      {!!location && (
        <StyleTouchable
          onPress={() => {
            setLocation('');
            inputRef.current?.clear();
          }}
          customStyle={$backView}>
          <Feather name="x" style={[$iconClear, {color: theme.gray_600}]} />
        </StyleTouchable>
      )}
      <StyleTouchable
        customStyle={$backView}
        onPress={() => modalFilterRef.current?.show()}>
        <StyleIcon
          source={Images.icons.filter}
          size={17}
          customStyle={{tintColor: theme.gray_500}}
        />
      </StyleTouchable>
    </View>
  );

  const renderToolBox = () => {
    if (isEqual(searchParams, {})) {
      return null;
    }
    return (
      <ToolSearch
        location={searchParams?.location || 'Ha Noi'}
        numberPeople={searchParams?.number_people}
        startPrice={searchParams?.start_price}
        endPrice={searchParams?.end_price}
        services={searchParams?.services}
        onPress={() => {
          inputRef.current?.blur();
          modalFilterRef.current?.show();
        }}
        containerStyle={$toolView}
      />
    );
  };

  return (
    <>
      <SafeView style={{backgroundColor: theme.background}}>
        {SearchBox}
        {renderToolBox()}
        <View style={$resultView}>
          {showResult && (
            <TabView
              listElements={[SearchListTour, SearchListGroupBuying]}
              tabBarStyle={$tabBarResult}
              listIconTabBar={[
                <IconTabBar icon={Images.icons.tour} title="discovery.tour" />,
                <IconTabBar
                  icon={Images.icons.shop}
                  title="discovery.groupBuying"
                />,
              ]}
              style={$resultView}
            />
          )}

          {displayHint && (
            <SearchSuggestions
              onTouchBackground={() => inputRef.current?.blur()}
              onSearch={text => {
                inputRef.current?.blur();
                setLocation(text);
                setSearchParams({...searchParams, location: text});
              }}
            />
          )}
        </View>
      </SafeView>

      <ModalSearchFilter
        ref={modalFilterRef}
        onChangeSearch={value => setSearchParams({...value, location})}
        initSearchParams={initSearchParams.current}
        isGetFromAsync
      />
    </>
  );
};

const $backView: ViewStyle = {
  width: verticalScale(40),
  height: verticalScale(40),
  alignItems: 'center',
  justifyContent: 'center',
};
const $searchView: ViewStyle = {
  width: '100%',
  height: verticalScale(40),
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: verticalScale(5),
  borderBottomWidth: borderWidthTiny,
};
const $iconBack: TextStyle = {
  fontSize: moderateScale(22),
};
const $input: TextStyle = {
  flex: 1,
  fontSize: FONT_SIZE.f1,
};
const $iconClear: TextStyle = {
  fontSize: moderateScale(20),
};
const $toolView: ViewStyle = {
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
};
const $resultView: ViewStyle = {
  flex: 1,
};
const $tabBarResult: ViewStyle = {
  paddingHorizontal: scale(50),
  paddingTop: 0,
};

export default SearchScreen;
