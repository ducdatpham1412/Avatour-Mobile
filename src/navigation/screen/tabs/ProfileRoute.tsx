import DetailGroupBuying from 'feature/discovery/DetailGroupBuying';
import EditProfile from 'feature/profile/EditProfile';
import MyProfile from 'feature/profile/MyProfile';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {isIOS} from 'utility/assistant';

const ProfileStack = createSharedElementStackNavigator();

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

                <ProfileStack.Screen
                    name={PROFILE_ROUTE.editProfile}
                    component={EditProfile}
                />

                <ProfileStack.Screen
                    name={PROFILE_ROUTE.detailGroupBuying}
                    component={DetailGroupBuying}
                    sharedElementsConfig={route => {
                        if (isIOS) {
                            return [
                                `item.group_buying.${route.params.item.id}.false`,
                            ];
                        }
                        return [];
                    }}
                />
            </ProfileStack.Navigator>
        </>
    );
};

export default ProfileRoute;
