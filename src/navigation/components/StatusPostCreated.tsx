import {setPostCreatedHandling} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const StatusPostCreated = () => {
  const theme = useTheme();
  const {status, data} = useAppSelector(
    state => state.logicSlice.postCreatedHandling,
  );

  if (status === 'done') {
    return null;
  }

  const onClose = () => {
    setPostCreatedHandling({
      status: 'done',
      data: undefined,
    });
  };
  const onGoToPost = () => {
    if (status === 'success') {
      navigate(MAIN_SCREEN.profileRoute, {
        screen: PROFILE_ROUTE.myProfile,
      });
    } else if (status === 'error') {
      const temp: any = data;
      if (temp.prices) {
        navigate(PROFILE_ROUTE.createGroupBuying, {
          itemError: data,
        });
      } else {
        navigate(PROFILE_ROUTE.createPostPreview, {
          itemError: data,
        });
      }
    }
    onClose();
  };

  return (
    <View style={styles.postCreatedView}>
      <StyleTouchable
        style={[
          styles.postCreatedHandling,
          {borderColor: theme.highlightColor},
        ]}
        onPress={onGoToPost}>
        <StyleImage
          source={{uri: data?.images[0]}}
          customStyle={styles.image}
        />

        <View style={styles.spaceBackground} />
        {status === 'loading' && (
          <AntDesign name="loading1" style={styles.textStatus} />
        )}
        {status === 'success' && (
          <AntDesign name="check" style={styles.textStatus} />
        )}
        {status === 'error' && (
          <MaterialIcons name="error-outline" style={styles.textError} />
        )}
      </StyleTouchable>
      {status === 'success' && (
        <StyleTouchable
          customStyle={styles.closeBox}
          hitSlop={5}
          onPress={onClose}>
          <Feather name="x" style={styles.textClose} />
        </StyleTouchable>
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  postCreatedView: {
    position: 'absolute',
    top: '100@vs',
    left: '20@s',
    padding: '5@s',
  },
  postCreatedHandling: {
    borderRadius: '30@ms',
    borderWidth: '3@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '30@ms',
    height: '30@ms',
    borderRadius: '25@ms',
  },
  spaceBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Theme.darkTheme.backgroundColor,
    borderRadius: '25@ms',
    opacity: 0.6,
  },
  textStatus: {
    position: 'absolute',
    fontSize: '20@ms',
    color: Theme.common.white,
  },
  textError: {
    position: 'absolute',
    fontSize: '17@ms',
    color: Theme.common.red,
  },
  closeBox: {
    position: 'absolute',
    backgroundColor: Theme.common.white,
    padding: '1.5@ms',
    borderRadius: '15@ms',
    right: 0,
    top: 0,
  },
  textClose: {
    fontSize: '10@ms',
    color: Theme.common.black,
  },
});

export default StatusPostCreated;
