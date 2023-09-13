import React, {
  createRef,
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TimePickerModal} from 'react-native-paper-dates';
import {I18Normalize} from 'utility/I18Next';

export type TimeValue = {
  hours: number;
  minutes: number;
};

interface TypeShow {
  title?: I18Normalize;
  initTime?: TimeValue;
  onChange: (value: TimeValue) => void;
}

const modalRef = createRef<ElementRef<typeof ModalTimePicker>>();

let promiseForNextShow: Promise<any>;
let resolveForNextShow: any;

const ModalTimePicker = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const {t} = useTranslation();

    const [visible, setVisible] = useState(false);

    const time = useRef<TimeValue>();
    const title = useRef<string>();
    const functionOnChange = useRef<TypeShow['onChange']>();

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: async params => {
          if (params) {
            await promiseForNextShow;
            if (params?.initTime) {
              time.current = params?.initTime;
            }
            if (params?.title) {
              title.current = t(params.title ?? 'profile.selectHour');
            }
            functionOnChange.current = params.onChange;
            setVisible(true);
          }
        },
        hide: () => {
          promiseForNextShow = new Promise(resolve => {
            resolveForNextShow = resolve;
          });
          setVisible(false);
        },
      }),
      [],
    );

    return (
      <TimePickerModal
        locale="en"
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          functionOnChange.current = undefined;
          resolveForNextShow?.();
        }}
        onConfirm={v => {
          setVisible(false);
          functionOnChange.current?.(v);
        }}
        animationType="slide"
        use24HourClock
        hours={time.current?.hours}
        minutes={time.current?.minutes}
        confirmLabel={t('common.ok')}
        cancelLabel={t('common.cancel')}
        label={title.current}
      />
    );
  },
);

export default Object.assign(ModalTimePicker, {
  show: (params: TypeShow) => {
    modalRef.current?.show(params);
  },
});
