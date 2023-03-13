import {apiGetListBubbleActive} from 'api/discovery';
import {POST_TYPE, TOPIC} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, LIST_TOPICS} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {SafeView, StyleIcon, StyleText, StyleTouchable} from 'components/base';
import AppInput from 'components/base/AppInput';
import StyleList from 'components/base/StyleList';
import LoadingScreen from 'components/LoadingScreen';
import ModalCommentLike from 'components/ModalCommentLike';
import StyleTabView from 'components/StyleTabView';
import {useTheme} from 'hook';
import usePaging from 'hook/usePaging';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN, {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {borderWidthTiny, fakeGroupBuying} from 'utility/assistant';
import {verticalScale} from 'utility/scale';
import BubbleGroupBuying from './components/BubbleGroupBuying';
import SearchSuggestions from './components/SearchSuggestions';
import HeaderFilterPrice from './HeaderFilterPrice';
import HeaderFilterTopic from './HeaderFilterTopic';

interface Props {
  route: {
    params: AppParamsList[DISCOVERY_ROUTE.searchScreen];
  };
}

const SearchScreen = ({route}: Props) => {
  const theme = useTheme();

  const topicRoute = useRef(route.params?.topic).current;
  const searchRoute = useRef(route.params?.search).current;
  const inputRef = useRef<TextInput>(null);
  const categoryRef = useRef<HeaderFilterTopic>(null);
  const priceRef = useRef<HeaderFilterPrice>(null);
  const modalRef = useRef<ModalCommentLike>(null);

  //   const {listPrices} = Redux.getResource();
  const {t} = useTranslation();

  //   const [price, setPrice] = useState(listPrices[0]);
  const [topics, setTopics] = useState(
    topicRoute !== undefined && topicRoute !== TOPIC.all
      ? [topicRoute]
      : LIST_TOPICS.map(item => item.id),
  );
  const [bubbleFocusing, setBubbleFocusing] = useState(fakeGroupBuying);
  const [search, setSearch] = useState(searchRoute || '');
  const [hadLoadMore, setHadLoadMore] = useState(
    !(topicRoute === undefined && searchRoute === undefined),
  );
  const [displayHint, setDisplayHint] = useState(
    topicRoute === undefined && searchRoute === undefined,
  );

  const {list, setList, setParams, onLoadMore, refreshing, onRefresh, loading} =
    usePaging({
      request: apiGetListBubbleActive,
      params: {
        topics: `[${String(topics)}]`,
        search,
        postTypes: `[${String([POST_TYPE.groupBuying])}]`,
      },
      isInitNotRunRequest:
        topicRoute === undefined && searchRoute === undefined,
    });

  useEffect(() => {
    if (topicRoute === undefined && searchRoute === undefined) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, []);

  useEffect(() => {
    setParams(preValue => ({
      ...preValue,
      topics: `[${String(topics)}]`,
    }));
  }, [topics]);

  //   useEffect(() => {
  //     setParams(preValue => ({
  //       ...preValue,
  //       prices: price.value ? `[${String(price.value)}]` : undefined,
  //     }));
  //   }, [price]);

  const RenderItem = useCallback(
    (item: TypeGroupBuying) => {
      return (
        <BubbleGroupBuying
          item={item}
          onGoToDetailGroupBuying={() => {
            navigate(ROOT_SCREEN.detailGroupBuying, {
              item,
              setList,
            });
          }}
          detailGroupTarget={ROOT_SCREEN.detailGroupBuying}
          onShowMoreOption={() => null}
          onHandleLike={() => null}
          onShowModalComment={(post, type) => {
            if (inputRef.current?.isFocused()) {
              inputRef.current.blur();
            }
            modalRef.current?.show({
              post,
              type,
            });
          }}
          onChangePostIdFocusing={() => null}
          containerStyle={styles.itemView}
        />
      );
    },
    [bubbleFocusing],
  );

  return (
    <SafeView style={{backgroundColor: theme.white}}>
      <View style={[styles.searchView, {borderBottomColor: theme.gray_300}]}>
        <StyleTouchable customStyle={styles.backView} onPress={goBack}>
          <Ionicons
            name="arrow-back"
            style={[styles.iconBack, {color: theme.gray_500}]}
          />
        </StyleTouchable>
        <AppInput
          ref={inputRef}
          style={[styles.input, {color: theme.black}]}
          placeholder={t('discovery.searchAround')}
          value={search}
          onChangeText={text => setSearch(text)}
          defaultValue={searchRoute}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (!hadLoadMore) {
              setHadLoadMore(true);
              onLoadMore();
            }
            setParams(preValue => ({
              ...preValue,
              search,
            }));
          }}
          placeholderTextColor={theme.gray_500}
          onFocus={() => setDisplayHint(true)}
          onBlur={() => setDisplayHint(false)}
        />
        {!!search && (
          <StyleTouchable
            onPress={() => {
              setSearch('');
            }}
            customStyle={styles.backView}>
            <Feather
              name="x"
              style={[styles.iconClear, {color: theme.gray_600}]}
            />
          </StyleTouchable>
        )}
        <StyleTouchable customStyle={styles.backView}>
          <StyleIcon
            source={Images.icons.filter}
            size={17}
            customStyle={{tintColor: theme.gray_500}}
          />
        </StyleTouchable>
      </View>

      <View style={styles.toolView}>
        <StyleTouchable
          customStyle={[styles.toolBox, {borderColor: theme.textHightLight}]}
          onPress={() => {
            inputRef.current?.blur();
            priceRef.current?.show();
          }}>
          <StyleIcon source={Images.icons.dollar} size={11} />
          <StyleText
            i18Text="profile.price"
            customStyle={[styles.textTool, {color: theme.textHightLight}]}>
            {/* {!!price.value && (
              <StyleText
                originValue={` (${1})`}
                customStyle={[styles.textTool, {color: theme.textHightLight}]}
              />
            )} */}
          </StyleText>
          <AntDesign
            name="down"
            style={[styles.iconDown, {color: theme.textHightLight}]}
          />
        </StyleTouchable>
        <StyleTouchable
          customStyle={[
            styles.toolBox,
            {marginLeft: 15, borderColor: theme.textHightLight},
          ]}
          onPress={() => {
            inputRef.current?.blur();
            categoryRef.current?.show();
          }}>
          <StyleIcon
            source={Images.icons.category}
            size={11}
            customStyle={{tintColor: Theme.common.gradientTabBar1}}
          />
          <StyleText
            i18Text="discovery.category"
            i18Params={{
              value: topics.length,
            }}
            customStyle={[styles.textTool, {color: theme.textHightLight}]}
          />
          <AntDesign
            name="down"
            style={[styles.iconDown, {color: theme.textHightLight}]}
          />
        </StyleTouchable>
      </View>

      <View style={{flex: 1}}>
        <StyleTabView containerStyle={styles.tabViewContainer}>
          <View style={styles.elementView}>
            <StyleList
              data={list}
              renderItem={({item}) => RenderItem(item)}
              keyExtractor={item => item.id}
              keyboardDismissMode="on-drag"
              refreshing={refreshing}
              onRefresh={onRefresh}
              onLoadMore={onLoadMore}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
            />

            {loading && !displayHint && <LoadingScreen />}
          </View>
        </StyleTabView>

        {displayHint && (
          <SearchSuggestions
            onTouchBackground={() => inputRef.current?.blur()}
            onSearch={text => {
              inputRef.current?.blur();
              setSearch(text);
              if (!hadLoadMore) {
                setHadLoadMore(true);
                onLoadMore();
              }
              setParams(preValue => ({
                ...preValue,
                search: text,
              }));
            }}
          />
        )}
      </View>

      <ModalCommentLike
        ref={modalRef}
        theme={theme}
        bubbleFocusing={bubbleFocusing}
        updateBubbleFocusing={value =>
          setBubbleFocusing((preValue: any) => ({
            ...preValue,
            ...value,
          }))
        }
        setTotalComments={value => {
          setBubbleFocusing(preValue => {
            if (preValue) {
              return {
                ...preValue,
                totalComments: value,
              };
            }
            return preValue;
          });
        }}
        increaseTotalComments={value => {
          setBubbleFocusing(preValue => {
            if (preValue) {
              return {
                ...preValue,
                totalComments: preValue.totalComments + value,
              };
            }
            return preValue;
          });
        }}
      />

      <HeaderFilterTopic
        ref={categoryRef}
        listTopics={topics}
        theme={theme}
        onChangeTopic={value => setTopics(value)}
      />
      {/* <HeaderFilterPrice
        ref={priceRef}
        price={price}
        listPrices={listPrices}
        onChangePrice={value => {
          const temp = listPrices.find(item => item.id === value.id);
          if (temp) {
            setPrice(temp);
          }
        }}
        theme={theme}
      /> */}
    </SafeView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  backView: {
    width: verticalScale(40),
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchView: {
    width: '100%',
    height: verticalScale(40),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '5@vs',
    paddingBottom: '5@vs',
    borderBottomWidth: borderWidthTiny,
  },
  iconBack: {
    fontSize: '22@ms',
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.f1,
  },
  iconClear: {
    fontSize: '20@ms',
  },
  tabViewContainer: {
    height: '100%',
  },
  elementView: {
    width: Metrics.width,
    height: '100%',
  },
  // tool
  toolView: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: '10@s',
    paddingVertical: '7@vs',
    alignItems: 'center',
  },
  toolBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '2@vs',
    borderWidth: borderWidthTiny,
    paddingHorizontal: '8@s',
    borderRadius: '20@ms',
  },
  textTool: {
    fontSize: FONT_SIZE.small,
    marginLeft: '7@s',
  },
  iconDown: {
    fontSize: '10@ms',
    marginLeft: '7@s',
  },
  itemView: {
    marginTop: 0,
    marginBottom: '10@vs',
  },
});

export default SearchScreen;
