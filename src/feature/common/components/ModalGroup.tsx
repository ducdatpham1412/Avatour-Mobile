import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {AppModalize, BoxInformation} from 'components';
import {StyleText, StyleTouchable} from 'components/base';
import {Avatar} from 'components/common';
import {useSafeArea, useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TextStyle, View, ViewStyle} from 'react-native';
import {randomAvt, renderListAvtInGroup} from 'utility/assistant';
import {formatMoney} from 'utility/format';
import {moderateScale, scale} from 'utility/scale';
import ModalPeopleInGroup from './ModalPeopleInGroup';

type Info = {
  maxMembers: number;
  isEstimate: boolean;
  indexGroup: number;
};

interface Show {
  join: TypeJoinPersonal;
  info: Info;
}

const ModalGroup = (_: any, ref: ForwardedRef<TypeShowModalize<Show>>) => {
  const {paddingBottom} = useSafeArea();
  const theme = useTheme();
  const {t} = useTranslation();
  const {avatar} = useAppSelector(state => state.accountSlice.passport.profile);

  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalPeopleInGroup =
    useRef<ElementRef<typeof ModalPeopleInGroup>>(null);

  const info = useRef<Info>({
    maxMembers: 0,
    isEstimate: true,
    indexGroup: 0,
  });
  const [join, setJoin] = useState<TypeJoinPersonal>();

  useImperativeHandle(
    ref,
    () => ({
      show: v => {
        if (v) {
          info.current = v.info;
          setJoin(v.join);
          modalRef.current?.show();
        }
      },
      hide: () => {
        modalRef.current?.hide();
      },
    }),
    [],
  );

  const content = () => {
    if (join) {
      const renderMembers = () => {
        const numberJoinsNow = info.current.isEstimate
          ? join.group.total_members - join.amount
          : join.group.total_members;
        const {listAvatars, isNewGroup} = renderListAvtInGroup({
          join,
          indexInGroup: info.current.indexGroup,
          maxMembers: info.current.maxMembers,
          isEstimate: info.current.isEstimate,
        });

        const onSeeMembers = () => {
          if (info.current.isEstimate) {
            modalPeopleInGroup.current?.show({
              groupId: null,
              initData: {
                id: null,
                name: t('discovery.estimate'),
                total_members: join.amount,
                created: '',
                members: [join],
              },
              groupName: `(${t('discovery.estimate')})`,
            });
          } else {
            modalPeopleInGroup.current?.show({
              groupId: join.group.id,
              groupName: join.group.name,
            });
          }
        };

        return (
          <View style={$viewInfo}>
            <View style={$infoGroup}>
              <StyleText
                i18Text={
                  isNewGroup ? 'discovery.newGroup' : 'discovery.numberJoinsNow'
                }
                i18Params={{
                  value: numberJoinsNow,
                }}
              />
            </View>
            <StyleTouchable customStyle={$members} onPress={onSeeMembers}>
              <View style={$touchListMembers}>
                {listAvatars.map((avt, i) => {
                  if (avt === 'me') {
                    return (
                      <Avatar
                        key={i}
                        source={{uri: avatar}}
                        size={28}
                        style={{
                          borderWidth: moderateScale(2),
                          borderColor: theme.orange,
                        }}
                      />
                    );
                  }
                  if (avt === 'other') {
                    return (
                      <Avatar
                        key={i}
                        source={randomAvt()}
                        size={28}
                        style={{opacity: 0.7}}
                      />
                    );
                  }

                  return (
                    <View
                      key={i}
                      style={[
                        $avtNull,
                        {
                          borderColor: theme.gray_300,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <StyleText
                i18Text="discovery.seeMembers"
                customStyle={[$textSeeMember, {color: theme.blue}]}
              />
            </StyleTouchable>
          </View>
        );
      };

      return (
        <BoxInformation
          listInformation={[
            {
              title: 'discovery.maximumMembers',
              content: info.current.maxMembers,
              contentStyle: $textNormal,
            },
            renderMembers(),
            {
              title: 'discovery.unitPrice',
              content: formatMoney(join.price / join.amount),
              contentStyle: $textNormal,
            },
            {
              title: 'discovery.amount',
              content: join.amount,
              contentStyle: $textNormal,
            },
            {
              title: 'discovery.price',
              content: formatMoney(join.price),
            },
          ]}
        />
      );
    }

    return null;
  };

  return (
    <>
      <AppModalize
        ref={modalRef}
        title="discovery.groupDay"
        titleParams={{
          value: info.current.isEstimate
            ? `(${t('discovery.estimate')})`
            : join?.group.name,
        }}
        containerStyle={{paddingBottom}}>
        {content()}
      </AppModalize>
      <ModalPeopleInGroup ref={modalPeopleInGroup} />
    </>
  );
};

const $viewInfo: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $infoGroup: ViewStyle = {
  paddingRight: scale(8),
  maxWidth: '50%',
};
const $members: ViewStyle = {
  flex: 1,
  alignItems: 'flex-end',
};
const $touchListMembers: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: scale(2),
};
const $textSeeMember: TextStyle = {
  fontSize: FONT_SIZE.f4,
  textDecorationLine: 'underline',
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textNormal: TextStyle = {
  fontWeight: 'normal',
};
const $avtNull: ViewStyle = {
  width: moderateScale(28),
  height: moderateScale(28),
  borderRadius: 50,
  borderWidth: moderateScale(1),
};

export default forwardRef(ModalGroup);
