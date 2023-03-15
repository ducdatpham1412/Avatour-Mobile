import dayjs from 'dayjs';
import React, {
  createRef,
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {DatePickerModal} from 'react-native-paper-dates';
import {CalendarDate} from 'react-native-paper-dates/src/Date/Calendar';
import {formatUTCDate} from 'utility/format';

interface TypeParamsChange {
  startDate: CalendarDate;
  endDate: CalendarDate;
}

interface TypeShow {
  startDate: string;
  endDate: string;
  onChangeRange: (value: TypeParamsChange) => void;
}

const modalRef = createRef<ElementRef<typeof ModalDateRangePicker>>();

const ModalDateRangePicker = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const [visible, setVisible] = useState(false);
    const [startDate, setStartDate] = useState(formatUTCDate(dayjs()));
    const [endDate, setEndDate] = useState(
      formatUTCDate(dayjs().add(2, 'days')),
    );
    const functionOnChange = useRef<TypeShow['onChangeRange']>();

    console.log('visible is: ', visible);

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: params => {
          console.log('params show: ', params);
          if (params) {
            setStartDate(formatUTCDate(params.startDate));
            setEndDate(formatUTCDate(params.endDate));
            functionOnChange.current = params.onChangeRange;
            setVisible(true);
          }
        },
        hide: () => {
          setVisible(false);
        },
      }),
      [],
    );

    return (
      <DatePickerModal
        locale="en"
        mode="range"
        visible={visible}
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        onDismiss={() => {
          setVisible(false);
          functionOnChange.current = undefined;
        }}
        onConfirm={value => {
          if (value?.startDate && value?.endDate) {
            functionOnChange.current?.(value);
            setVisible(false);
          }
        }}
        animationType="slide"
      />
    );
  },
);

export default Object.assign(ModalDateRangePicker, {
  show: (params: TypeShow) => {
    console.log('params first: ', params);
    modalRef.current?.show(params);
  },
});
