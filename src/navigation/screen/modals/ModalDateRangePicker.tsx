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
import {formatUTCDate} from 'utility/format';

interface TypeParamsChange {
  startDate: CalendarDate;
  endDate: CalendarDate;
}

interface TypeShow {
  startDate: string;
  endDate: string;
  onChangeRange: (value: TypeParamsChange) => void;
  validRange?: ValidRangeType;
}

const modalRef = createRef<ElementRef<typeof ModalDateRangePicker>>();

const ModalDateRangePicker = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const [visible, setVisible] = useState(false);
    const [startDate, setStartDate] = useState(formatUTCDate(dayjs()));
    const [endDate, setEndDate] = useState(
      formatUTCDate(dayjs().add(2, 'days')),
    );
    const [validRange, setValidRange] = useState<ValidRangeType>();
    const functionOnChange = useRef<TypeShow['onChangeRange']>();

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: params => {
          if (params) {
            setStartDate(formatUTCDate(params.startDate));
            setEndDate(formatUTCDate(params.endDate));
            if (params.validRange) {
              setValidRange(params.validRange);
            }
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
        validRange={validRange}
        onDismiss={() => {
          setVisible(false);
          functionOnChange.current = undefined;
          setValidRange(undefined);
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
    modalRef.current?.show(params);
  },
});
