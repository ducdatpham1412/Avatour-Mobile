import {MyProfile} from 'feature/profile';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const ProfileStack = createSharedElementStackNavigator<AppParamsList>();

const ProfileRoute = () => {
  return (
    <>
      <ProfileStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <ProfileStack.Screen
          name={PROFILE_ROUTE.myProfile}
          component={MyProfile}
        />
      </ProfileStack.Navigator>
    </>
  );
};

export default ProfileRoute;
