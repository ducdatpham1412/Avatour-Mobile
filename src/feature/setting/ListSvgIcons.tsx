import {FONT_SIZE} from 'asset';
import * as icons from 'asset/icons';
import {horizontalPadding} from 'asset/metrics';
import {StyleContainer, StyleList, StyleText} from 'components/base';
import {useSafeArea} from 'hook';
import React, {FunctionComponent, useCallback} from 'react';
import {View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {scale} from 'utility/scale';

const iconKeys = Object.keys(icons);

const ListSvgIcons = () => {
  const {bottom} = useSafeArea();

  const renderIcon = useCallback(
    (name: string, Icon: FunctionComponent<icons.IconSvgProps>) => {
      return (
        <View style={$iconView}>
          <Icon size={40} />
          <StyleText
            originValue={name}
            customStyle={{fontSize: FONT_SIZE.f4}}
          />
        </View>
      );
    },
    [],
  );

  return (
    <StyleContainer
      layOut="view"
      customStyle={{
        paddingHorizontal: horizontalPadding,
        paddingBottom: bottom,
      }}
      headerProps={{
        title: 'Icons' as I18Normalize,
      }}>
      <StyleList
        data={iconKeys}
        renderItem={({item}) => renderIcon(item, (icons as any)[item])}
        keyExtractor={item => String(item)}
        numColumns={3}
      />
    </StyleContainer>
  );
};

const $iconView: ViewStyle = {
  width: scale(343) / 3,
  height: scale(343) / 3,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: scale(23),
  borderWidth: borderWidthTiny,
};

export default ListSvgIcons;
