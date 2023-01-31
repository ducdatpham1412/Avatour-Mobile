import {TypeFollowResponse} from 'api/interface';
import {apiFollowUser} from 'api/module';
import {RELATIONSHIP} from 'asset/enum';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {onGoToProfile} from 'utility/assistant';

interface Props {
    item: TypeFollowResponse;
}

const ItemFollow = (props: Props) => {
    const {item} = props;
    const theme = Redux.getTheme();

    const [hadNotFollow, setHadNotFollow] = useState(
        item.relationship === RELATIONSHIP.notFollowing,
    );

    const onFollowUser = async () => {
        try {
            setHadNotFollow(false);
            await apiFollowUser(item.id);
        } catch (err) {
            setHadNotFollow(true);
            appAlert(err);
        }
    };

    return (
        <StyleTouchable
            style={styles.container}
            onPress={() => onGoToProfile(item.id)}
            disable={!item.id}>
            <StyleImage
                source={{uri: item.avatar}}
                customStyle={styles.avatar}
            />

            <View style={styles.nameDescriptionView}>
                <StyleText
                    originValue={item.name}
                    customStyle={[styles.textName, {color: theme.textColor}]}
                    numberOfLines={1}
                />
                {!!item.description && (
                    <StyleText
                        originValue={item.description}
                        customStyle={[
                            styles.textDescription,
                            {color: theme.borderColor},
                        ]}
                        numberOfLines={1}
                    />
                )}
            </View>

            <View style={styles.buttonFollowView}>
                {hadNotFollow && !!item.id && (
                    <StyleTouchable
                        customStyle={[
                            styles.buttonFollow,
                            {borderColor: theme.borderColor},
                        ]}
                        onPress={onFollowUser}>
                        <StyleText
                            i18Text="profile.follow.follow"
                            customStyle={[
                                styles.textFollow,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
                {!item.id && (
                    <MaterialCommunityIcons
                        name="incognito"
                        style={[
                            styles.iconIncognito,
                            {color: theme.borderColor},
                        ]}
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
        marginVertical: '7@vs',
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
        marginTop: '5@vs',
    },
    buttonFollowView: {
        width: '70@s',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonFollow: {
        width: '100%',
        paddingVertical: '3@vs',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: '5@ms',
    },
    textFollow: {
        fontSize: '11@ms',
    },
    iconIncognito: {
        fontSize: '20@ms',
    },
});

export default ItemFollow;
