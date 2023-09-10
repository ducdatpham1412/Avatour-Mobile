import {AppInput, ModalEdit} from 'components/base';
import {useLoading, useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardTypeOptions, TextStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {logger} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface TypeShow {
  defaultValue?: string;
  // onSaveFunction have not to have try-catch, we catch it in this component
  onSave?: (value: string) => Promise<void> | void;
  checkEnableButton?: (value: string) => boolean;
  validateInput?: (text: string) => boolean;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: I18Normalize;
}

const modalInputRef = createRef<ElementRef<typeof ModalInputEdit>>();

const ModalInputEdit = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const theme = useTheme();
    const {t} = useTranslation();
    const {loading, setLoading} = useLoading();

    const modalRef = useRef<ElementRef<typeof ModalEdit>>(null);
    const onSaveFunctionRef = useRef<(value: string) => Promise<void> | void>();
    const checkEnableButton = useRef<(value: string) => boolean>();
    const validateInput = useRef<(text: string) => boolean>();

    const [keyboardType, setKeyboardType] =
      useState<KeyboardTypeOptions>('default');
    const [placeholder, setPlaceholder] = useState<I18Normalize>('common.null');
    const [isValid, setIsValid] = useState(true);

    const [value, setValue] = useState('');

    useImperativeHandle(
      ref ?? modalInputRef,
      () => ({
        show: params => {
          const newValue = params?.defaultValue ?? '';
          setValue(newValue);
          setKeyboardType(params?.keyboardType ?? 'default');
          setPlaceholder(params?.placeholder ?? 'common.null');
          setIsValid(
            params?.checkEnableButton
              ? params?.checkEnableButton(newValue)
              : true,
          );
          onSaveFunctionRef.current = params?.onSave;
          checkEnableButton.current = params?.checkEnableButton;
          validateInput.current = params?.validateInput;
          modalRef.current?.show();
        },
        hide: () => {
          modalRef.current?.hide();
        },
      }),
      [],
    );

    const onSave = async () => {
      try {
        setLoading(true);
        await onSaveFunctionRef.current?.(value);
        modalRef.current?.hide();
        setValue('');
      } catch (err) {
        logger('Error save: ', err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <ModalEdit
        ref={modalRef}
        loading={loading}
        onSave={onSave}
        disable={!isValid}
        onDismiss={() => {
          onSaveFunctionRef.current = undefined;
          checkEnableButton.current = undefined;
          validateInput.current = undefined;
        }}>
        <AppInput
          style={[$inputContainer, {borderColor: theme.gray_300}]}
          value={value}
          onChangeText={text => {
            if (validateInput.current && !validateInput.current?.(text)) {
              return;
            }
            setValue(text);
            const temp = checkEnableButton.current
              ? checkEnableButton.current?.(text)
              : true;
            if (temp !== isValid) {
              setIsValid(temp);
            }
          }}
          keyboardType={keyboardType}
          placeholder={t(placeholder)}
          autoFocus
        />
      </ModalEdit>
    );
  },
);

const $inputContainer: TextStyle = {
  width: '100%',
  borderWidth: moderateScale(0.5),
  marginTop: verticalScale(10),
  borderRadius: 100,
  paddingHorizontal: scale(12),
  paddingTop: moderateScale(12),
  paddingBottom: moderateScale(12),
};

export default Object.assign(ModalInputEdit, {
  show: (params: TypeShow) => modalInputRef.current?.show(params),
  hide: () => modalInputRef.current?.hide(),
});
