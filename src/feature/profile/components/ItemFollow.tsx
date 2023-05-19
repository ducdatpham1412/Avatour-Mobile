import {TypeFollowResponse} from 'api/interface';
import {apiFollowUser} from 'api/profile';
import {updatePassport} from 'app-redux';
import Store from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {RELATIONSHIP} from 'asset/enum';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {onGoToProfile} from 'utility/assistant';
import {impactLight} from 'utility/haptic';

interface Props {
  item: TypeFollowResponse;
}

const onFollowUser = async (
  userId: number,
  setHadNotFollow: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    impactLight();
    setHadNotFollow(false);
    await apiFollowUser(userId);
    const {followings} = Store.getState().accountSlice.passport.profile;
    updatePassport({
      profile: {
        followings: followings + 1,
      },
    });
  } catch (err) {
    setHadNotFollow(true);
    ModalAlert.error({
      content: err,
    });
  }
};

const ItemFollow = ({item}: Props) => {
  const theme = useTheme();

  const [hadNotFollow, setHadNotFollow] = useState(
    item.relationship === RELATIONSHIP.notFollowing,
  );

  return (
    <StyleTouchable
      style={styles.container}
      onPress={() => onGoToProfile(item.id)}
      disable={!item.id}>
      <StyleImage source={{uri: item.avatar}} customStyle={styles.avatar} />

      <View style={styles.nameDescriptionView}>
        <StyleText
          originValue={item.name}
          customStyle={styles.textName}
          numberOfLines={1}
        />
        {!!item.description && (
          <StyleText
            originValue={item.description}
            customStyle={styles.textDescription}
            numberOfLines={1}
          />
        )}
      </View>

      <View style={styles.buttonFollowView}>
        {hadNotFollow && !!item.id && (
          <StyleTouchable
            customStyle={[styles.buttonFollow, {backgroundColor: theme.p_200}]}
            onPress={() => onFollowUser(item?.id, setHadNotFollow)}>
            <StyleText
              i18Text="profile.follow"
              customStyle={styles.textFollow}
            />
          </StyleTouchable>
        )}
        {!item.id && (
          <MaterialCommunityIcons
            name="incognito"
            style={[styles.iconIncognito, {color: theme.borderColor}]}
          />
        )}
      </View>
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: '50@vs',
    paddingHorizontal: '5@s',
    marginTop: '8@vs',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: '40@vs',
    height: '40@vs',
    borderRadius: '30@vs',
  },
  nameDescriptionView: {
    flex: 1,
    height: '50@vs',
    justifyContent: 'center',
    paddingHorizontal: '10@s',
  },
  textName: {
    fontSize: '14@ms',
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: '12@ms',
    opacity: 0.7,
    marginTop: '1@vs',
  },
  buttonFollowView: {
    width: '70@s',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFollow: {
    width: '100%',
    paddingVertical: '5@vs',
    alignItems: 'center',
    borderRadius: '5@ms',
  },
  textFollow: {
    fontSize: FONT_SIZE.f4,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  iconIncognito: {
    fontSize: '20@ms',
  },
});

export default ItemFollow;
