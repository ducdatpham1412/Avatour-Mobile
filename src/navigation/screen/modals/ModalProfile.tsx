import {Metrics} from 'asset/metrics';
import {AppModalize} from 'components';
import {OtherProfile} from 'feature/profile';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {ViewStyle} from 'react-native';

type TypeShow = {
  userId: number;
};

const modalProfileRef = createRef<ElementRef<typeof ModalProfile>>();

const ModalProfile = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const theme = useTheme();
    const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
    const [userId, setUserId] = useState<number>();
    const [showContent, setShowContent] = useState(false);

    useImperativeHandle(
      ref ?? modalProfileRef,
      () => ({
        show: value => {
          setUserId(value?.userId);
          setShowContent(true);
          modalRef.current?.show();
        },
        hide: () => {
          modalRef.current?.hide();
        },
      }),
      [],
    );

    return (
      <AppModalize
        ref={modalRef}
        modalHeight={Metrics.height * 0.75}
        onClosed={() => setShowContent(false)}
        containerStyle={[$container, {backgroundColor: theme.background}]}>
        {!!userId && showContent && (
          <OtherProfile route={{params: {id: userId, showHeader: false}}} />
        )}
      </AppModalize>
    );
  },
);

const $container: ViewStyle = {
  paddingHorizontal: 0,
};

export default Object.assign(ModalProfile, {
  show: (value: TypeShow) => modalProfileRef.current?.show(value),
  hide: () => modalProfileRef.current?.hide(),
});
