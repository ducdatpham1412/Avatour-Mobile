import {safePaddingNotZero} from 'asset/metrics';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {useTranslation} from 'react-i18next';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useUpdate} from 'react-use';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, verticalScale} from 'utility/scale';

type TypeShowElement = {
  title: I18Normalize;
  onPress: () => void;
};

const modalRef = createRef<ElementRef<typeof ModalActionSheet>>();

const ModalActionSheet = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShowElement[]>>) => {
    const update = useUpdate();
    const {bottom} = useSafeAreaInsets();
    const theme = useTheme();
    const {t} = useTranslation();
    const listOptions = useRef<TypeShowElement[]>([]);
    const actionSheetRef = useRef<any>(null);

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: value => {
          if (value) {
            listOptions.current = value.concat({
              title: 'common.cancel',
              onPress: () => actionSheetRef.current?.hide(),
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
        options={listOptions.current.map(item => t(item.title))}
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
            marginBottom: verticalScale(5),
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

export default Object.assign(ModalActionSheet, {
  show: (value: {options: TypeShowElement[]}) =>
    modalRef.current?.show(value.options),
  hide: () => modalRef.current?.hide(),
});
