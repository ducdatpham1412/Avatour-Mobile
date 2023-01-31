import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import ActionSheet from 'react-native-actionsheet';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    listTextAndAction: Array<{
        text: I18Normalize;
        action(): void;
    }>;
    cancelButtonIndex?: number;
}

const StyleActionSheet = (props: Props, ref: any) => {
    const {
        listTextAndAction,
        cancelButtonIndex = listTextAndAction.length - 1,
    } = props;
    const {t} = useTranslation();

    const listOptions = listTextAndAction.map(item => t(item.text));

    const onChooseAction = (index: number) => {
        listTextAndAction[index].action();
    };

    return (
        <ActionSheet
            ref={ref}
            options={listOptions}
            cancelButtonIndex={cancelButtonIndex}
            onPress={onChooseAction}
        />
    );
};

export default forwardRef(StyleActionSheet);
