import {apiUnBlockUser} from 'api/setting';
import {useAppSelector} from 'app-redux/store';
import {StyleIcon, StyleList, StyleText, StyleTouchable} from 'components/base';
import {useApi, useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {moderateScale, scale} from 'utility/scale';

interface Props {
  isOpening: boolean;
}

interface ModuleBlock {
  image: string;
  name: string;
  onUnBlock(): void;
}

const ModuleUserBlock = (props: ModuleBlock) => {
  const {image, name, onUnBlock} = props;
  const theme = useTheme();

  return (
    <View style={[styles.moduleUserBlock, {backgroundColor: theme.background}]}>
      <StyleIcon customStyle={styles.avatar} source={{uri: image}} size={30} />
      <StyleText
        originValue={name}
        customStyle={styles.text}
        numberOfLines={1}
      />
      <StyleTouchable onPress={onUnBlock}>
        <Feather
          name="x"
          style={[styles.iconCancel, {color: theme.gray_500}]}
        />
      </StyleTouchable>
    </View>
  );
};

/**
 * Boss here
 */
const UserBlocked = ({isOpening}: Props) => {
  const {modeExp} = useAppSelector(state => state.accountSlice);

  const {data, mutate, loading, validating} = useApi<TypeBlock[]>({
    path: modeExp ? null : '/setting/blocks',
    config: {
      revalidateAll: true,
    },
  });

  const aim = useSharedValue(0);
  const heightStyle = useAnimatedStyle(() => ({
    height: aim.value,
  }));

  useEffect(() => {
    aim.value = withTiming(isOpening ? verticalScale(300) : 0, {
      duration: 300,
    });
  }, [isOpening]);

  const onUnBlock = async (userId: number) => {
    try {
      await apiUnBlockUser(userId);
      await mutate(pre => pre?.filter(item => item?.profile?.id !== userId), {
        revalidate: false,
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <Animated.View style={[styles.container, heightStyle]}>
      {!!data && (
        <StyleList
          data={data}
          renderItem={({item}) => (
            <ModuleUserBlock
              image={item?.profile?.avatar}
              name={item?.profile?.name}
              onUnBlock={() => onUnBlock(item?.profile?.id)}
            />
          )}
          initLoading={loading}
          refreshing={validating}
          onRefresh={mutate}
        />
      )}
    </Animated.View>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: verticalScale(15),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  moduleUserBlock: {
    width: '100%',
    height: moderateScale(45),
    marginVertical: verticalScale(3),
    borderRadius: moderateScale(20),
    paddingHorizontal: verticalScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 50,
    marginRight: scale(4),
  },
  text: {
    flex: 1,
  },
  iconCancel: {
    fontSize: moderateScale(17),
  },
});

export default UserBlocked;
