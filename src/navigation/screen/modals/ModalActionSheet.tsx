import {FONT_SIZE} from 'asset';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {TextStyle, View} from 'react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useUpdate} from 'react-use';
import {I18Normalize} from 'utility/I18Next';
import {impactLight} from 'utility/haptic';
import {moderateScale, verticalScale} from 'utility/scale';

type TypeActionSheetElement = {
  title: Element;
  onPress: () => void;
};

type TypeShow = {
  options: Array<{title: I18Normalize; onPress: () => void} | null>;
  fontSize?: number;
};

const modalRef = createRef<ElementRef<typeof ModalActionSheet>>();

const ModalActionSheet = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const update = useUpdate();
    const {bottom} = useSafeAreaInsets();
    const theme = useTheme();
    const listOptions = useRef<TypeActionSheetElement[]>([]);
    const actionSheetRef = useRef<any>(null);

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: value => {
          if (value) {
            impactLight();

            value.options.forEach(option => {
              if (option !== null) {
                listOptions.current.push({
                  title: (
                    <View>
                      <StyleText
                        i18Text={option.title}
                        customStyle={[
                          $title,
                          {fontSize: value.fontSize ?? FONT_SIZE.f1},
                        ]}
                      />
                    </View>
                  ),
                  onPress: () => {
                    option.onPress?.();
                    listOptions.current = [];
                  },
                });
              }
            });

            listOptions.current.push({
              title: (
                <View>
                  <StyleText
                    i18Text="common.cancel"
                    customStyle={{fontSize: FONT_SIZE.f1, fontWeight: 'bold'}}
                  />
                </View>
              ),
              onPress: () => {
                actionSheetRef.current?.hide();
                listOptions.current = [];
              },
            });
            update();
            actionSheetRef.current?.show();
          }
        },
        hide: () => null,
      }),
      [],
    );

    return (
      <ActionSheet
        ref={actionSheetRef}
        options={listOptions.current.map(item => item.title)}
        cancelButtonIndex={listOptions.current.length - 1}
        onPress={(index: number) => {
          listOptions.current?.[index]?.onPress();
        }}
        styles={{
          cancelButtonBox: {
            height: moderateScale(60),
            backgroundColor: theme.white,
            marginBottom: bottom || safePaddingNotZero,
          },
          buttonBox: {
            height: moderateScale(60),
            backgroundColor: theme.white,
            marginBottom: verticalScale(8),
          },
          body: {
            backgroundColor: theme.background,
          },
        }}
        tintColor={theme.black}
      />
    );
  },
);

const $title: TextStyle = {
  fontSize: FONT_SIZE.f1,
  paddingHorizontal: horizontalPadding,
  textAlign: 'center',
};

export default Object.assign(ModalActionSheet, {
  show: (value: TypeShow) => modalRef.current?.show(value),
  hide: () => modalRef.current?.hide(),
});
