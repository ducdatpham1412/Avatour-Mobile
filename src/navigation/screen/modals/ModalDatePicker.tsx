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
import {
  CalendarDate,
  ValidRangeType,
} from 'react-native-paper-dates/src/Date/Calendar';
import {addDate, formatUTCDate} from 'utility/format';

interface TypeParamsChange {
  date: CalendarDate;
}

interface TypeShow {
  date: string;
  onChangeRange: (value: TypeParamsChange) => void;
  validRange?: ValidRangeType;
}

const modalRef = createRef<ElementRef<typeof ModalDatePicker>>();

const ModalDatePicker = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const functionOnChange = useRef<TypeShow['onChangeRange']>();
    const [visible, setVisible] = useState(false);
    const [validRange, setValidRange] = useState<ValidRangeType>();
    const [date, setDate] = useState(formatUTCDate(dayjs()));

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: params => {
          if (params) {
            setDate(params.date);
            functionOnChange.current = params.onChangeRange;
            if (params?.validRange) {
              setValidRange(params?.validRange);
            }
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
        mode="single"
        visible={visible}
        date={new Date(date)}
        validRange={validRange}
        onDismiss={() => {
          setVisible(false);
          functionOnChange.current = undefined;
          setValidRange(undefined);
        }}
        onConfirm={value => {
          if (value.date) {
            functionOnChange.current?.(value);
            setVisible(false);
          }
        }}
        animationType="slide"
      />
    );
  },
);

export default Object.assign(ModalDatePicker, {
  show: (params: TypeShow) => {
    modalRef.current?.show(params);
  },
});
