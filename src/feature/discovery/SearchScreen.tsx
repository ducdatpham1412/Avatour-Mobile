import {setGestureHandle} from 'app-redux';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleTabView} from 'components';
import {SafeView, StyleIcon, StyleText, StyleTouchable} from 'components/base';
import AppInput from 'components/base/AppInput';
import {useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {goBack} from 'navigation/NavigationService';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  ScrollView,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useUpdateEffect} from 'react-use';
import {borderWidthTiny, chooseTextTopic} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalSearchFilter} from './components';
import SearchSuggestions from './components/SearchSuggestions';
import {SearchListGroupBuying, SearchListTour} from './screens';

const SearchScreen = ({
  route,
}: AppRouteParams<AppParamsList[DISCOVERY_ROUTE.searchScreen]>) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const servicesRoute = useRef(route.params?.services).current;
  const searchRoute = useRef(route.params?.search).current;
  const isRouteParamsNull = useRef(
    servicesRoute === undefined && searchRoute === undefined,
  ).current;
  const initSearchParams = useRef(
    servicesRoute ? {services: [servicesRoute]} : {},
  ).current;

  const modalFilterRef = useRef<ElementRef<typeof ModalSearchFilter>>(null);
  const inputRef = useRef<TextInput>(null);
  const checkShouldSetShowResultByTrue = useRef(!isRouteParamsNull);

  const [displayHint, setDisplayHint] = useState(isRouteParamsNull);
  const [showResult, setShowResult] = useState(!isRouteParamsNull);

  const [location, setLocation] = useState(searchRoute || '');
  const [searchParams, setSearchParams] =
    useState<TypeSearchParams>(initSearchParams);

  const [indexFocus, setIndexFocus] = useState(0);
  const translateIndicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRouteParamsNull) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, []);

  useUpdateEffect(() => {
    if (!isEqual(searchParams, {})) {
      if (checkShouldSetShowResultByTrue.current) {
        setShowResult(true);
      } else {
        checkShouldSetShowResultByTrue.current = true;
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
        defaultValue={searchRoute}
        returnKeyType="search"
        onSubmitEditing={() => {
          setSearchParams(pre => ({
            ...pre,
            location,
          }));
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

  let ToolBox = null;
  if (!isEqual(searchParams, {})) {
    ToolBox = (
      <View style={$toolView}>
        <ScrollView
          horizontal
          contentContainerStyle={$contentToolView}
          showsHorizontalScrollIndicator={false}>
          <StyleTouchable
            customStyle={[$toolBox, {borderColor: theme.gray_600}]}
            onPress={() => {
              inputRef.current?.blur();
              modalFilterRef.current?.show();
            }}>
            <StyleIcon
              source={Images.icons.location}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            <StyleText
              originValue={searchParams?.location || 'Ha Noi'}
              customStyle={[$textTool, {color: theme.gray_600}]}
            />
          </StyleTouchable>

          {searchParams.number_people && (
            <StyleTouchable
              customStyle={[
                $toolBox,
                {borderColor: theme.gray_600, marginLeft: scale(8)},
              ]}
              onPress={() => {
                inputRef.current?.blur();
                modalFilterRef.current?.show();
              }}>
              <StyleIcon
                source={Images.icons.username}
                size={11}
                customStyle={{tintColor: theme.gray_600}}
              />
              <StyleText
                i18Text="discovery.valuePeople"
                i18Params={{
                  value: searchParams.number_people,
                }}
                customStyle={[$textTool, {color: theme.gray_600}]}
              />
            </StyleTouchable>
          )}

          {!!searchParams.start_price && !!searchParams.end_price && (
            <StyleTouchable
              customStyle={[
                $toolBox,
                {marginLeft: scale(8), borderColor: theme.gray_600},
              ]}
              onPress={() => {
                inputRef.current?.blur();
                modalFilterRef.current?.show();
              }}>
              <StyleIcon
                source={Images.icons.price}
                size={11}
                customStyle={{tintColor: theme.gray_600}}
              />
              <StyleText
                originValue={`${formatLocaleNumber(
                  String(searchParams.start_price),
                )} - ${formatLocaleNumber(String(searchParams.end_price))} vnd`}
                customStyle={[$textTool, {color: theme.gray_600}]}
              />
            </StyleTouchable>
          )}

          {searchParams?.services?.length && (
            <StyleTouchable
              customStyle={[
                $toolBox,
                {marginLeft: scale(8), borderColor: theme.gray_600},
              ]}
              onPress={() => {
                inputRef.current?.blur();
                modalFilterRef.current?.show();
              }}>
              <StyleIcon
                source={Images.icons.category}
                size={11}
                customStyle={{tintColor: theme.gray_600}}
              />
              {searchParams?.services?.map(item => {
                return (
                  <StyleText
                    key={item}
                    i18Text={chooseTextTopic(item)}
                    customStyle={[$textTool, {color: theme.gray_600}]}
                  />
                );
              })}
            </StyleTouchable>
          )}
        </ScrollView>

        {showResult && (
          <View style={$toolPostSearch}>
            <View style={$postSearchBox}>
              <StyleTouchable customStyle={$searchTab}>
                <StyleText
                  i18Text="discovery.tour"
                  customStyle={[
                    $textSearchTab,
                    {color: indexFocus === 0 ? theme.p_900 : theme.gray_500},
                  ]}
                />
              </StyleTouchable>
              <View style={{width: indicatorTabWidth}} />
              <StyleTouchable customStyle={$searchTab}>
                <StyleText
                  i18Text="discovery.groupBuying"
                  customStyle={[
                    $textSearchTab,
                    {color: indexFocus === 1 ? theme.p_900 : theme.gray_500},
                  ]}
                />
              </StyleTouchable>
            </View>
            <Animated.View
              style={[
                $indicatorTab,
                {
                  backgroundColor: theme.p_900,
                  transform: [{translateX: translateIndicatorX}],
                },
              ]}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <>
      <SafeView style={{backgroundColor: theme.background}}>
        {SearchBox}
        {ToolBox}
        <View style={$resultView}>
          {showResult && (
            <StyleTabView
              containerStyle={$resultView}
              onChangeTabIndex={index => {
                setIndexFocus(index);
                if (index === 0) {
                  setGestureHandle('searchScreen', true);
                } else {
                  setGestureHandle('searchScreen', false);
                }
              }}
              onScroll={e =>
                translateIndicatorX.setValue(
                  2 * indicatorWidth * e.position +
                    2 * indicatorTabWidth * e.position,
                )
              }>
              <SearchListTour searchParams={searchParams} />
              <SearchListGroupBuying searchParams={searchParams} />
            </StyleTabView>
          )}

          {displayHint && (
            <SearchSuggestions
              onTouchBackground={() => inputRef.current?.blur()}
              onSearch={text => {
                inputRef.current?.blur();
                setLocation(text);
                setSearchParams(pre => ({
                  ...pre,
                  location: text,
                }));
              }}
            />
          )}
        </View>
      </SafeView>

      <ModalSearchFilter
        ref={modalFilterRef}
        onChangeSearch={value => setSearchParams({...value, location})}
        initSearchParams={initSearchParams}
      />
    </>
  );
};

const indicatorWidth = moderateScale(120);
const indicatorTabWidth = moderateScale(10);
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
  width: '100%',
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
};
const $contentToolView: ViewStyle = {
  paddingHorizontal: scale(12),
};
const $toolBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: verticalScale(2),
  borderWidth: borderWidthTiny,
  paddingHorizontal: scale(8),
  borderRadius: 30,
};
const $textTool: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(7),
};
const $resultView: ViewStyle = {
  flex: 1,
};
const $toolPostSearch: ViewStyle = {
  width: 2 * indicatorWidth,
  alignSelf: 'center',
  marginTop: verticalScale(4),
};
const $postSearchBox: ViewStyle = {
  flexDirection: 'row',
};
const $searchTab: ViewStyle = {
  width: indicatorWidth,
  paddingVertical: verticalScale(8),
  alignItems: 'center',
  justifyContent: 'center',
};
const $textSearchTab: TextStyle = {
  fontWeight: '500',
};
const $indicatorTab: ViewStyle = {
  width: indicatorWidth,
  height: moderateScale(1.25),
  borderRadius: 10,
};

export default SearchScreen;
