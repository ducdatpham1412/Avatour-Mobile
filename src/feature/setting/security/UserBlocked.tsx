import {apiGetListBlocked, apiUnBlockUser} from 'api/module';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {memo, useEffect, useRef, useState} from 'react';
import {Animated, ScrollView, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    isOpening: boolean;
}

interface ModuleBlock {
    image: string;
    name: string;
    onUnBlock(): void;
}

const ModuleUserBlock = (props: ModuleBlock) => {
    const theme = Redux.getTheme();
    const {image, name, onUnBlock} = props;

    return (
        <View
            style={[
                styles.moduleUserBlock,
                {backgroundColor: theme.holderColor},
            ]}>
            <View style={styles.avatarBox}>
                <StyleImage
                    customStyle={[
                        styles.avatar,
                        {borderColor: theme.borderColor},
                    ]}
                    source={{uri: image}}
                />
            </View>

            <View style={styles.nameBox}>
                <StyleText
                    originValue={name}
                    customStyle={[styles.nameText, {color: theme.textColor}]}
                />
            </View>

            <View style={styles.buttonCancelBox}>
                <StyleTouchable onPress={onUnBlock}>
                    <Feather
                        name="x"
                        style={[styles.iconCancel, {color: theme.borderColor}]}
                    />
                </StyleTouchable>
            </View>
        </View>
    );
};

/**
 * Boss here
 */
const UserBlocked = ({isOpening}: Props) => {
    const isModeExp = Redux.getModeExp();

    const aim = useRef(new Animated.Value(0)).current;
    const [height, setHeight] = useState(0);
    aim.addListener(({value}) => setHeight(value));

    const [listBlocked, setListBlocked] = useState<
        Array<{
            id: number;
            profile: {
                id: number;
                avatar: string;
                name: string;
            };
        }>
    >();

    const getData = async () => {
        if (isModeExp) {
            setListBlocked([]);
        } else {
            try {
                const res = await apiGetListBlocked();
                setListBlocked(res.data);
            } catch (err) {
                appAlert(err);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        Animated.timing(aim, {
            toValue: isOpening ? verticalScale(300) : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpening]);

    const onUnBlock = async (id: number) => {
        try {
            await apiUnBlockUser(id);
            const temp: Array<any> = [];
            listBlocked?.forEach(item => {
                if (item.profile.id !== id) {
                    temp.push(item);
                }
            });
            setListBlocked(temp);
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <Animated.View style={[styles.container, {height}]}>
            <ScrollView>
                {!!listBlocked &&
                    listBlocked.map(item => (
                        <ModuleUserBlock
                            key={item.id}
                            image={item.profile.avatar}
                            name={item.profile.name}
                            onUnBlock={() => onUnBlock(item.profile.id)}
                        />
                    ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '90%',
        paddingHorizontal: '15@vs',
        borderRadius: '10@vs',
        overflow: 'hidden',
    },
    moduleUserBlock: {
        width: '100%',
        height: '45@vs',
        marginVertical: '3@vs',
        borderRadius: '20@vs',
        paddingHorizontal: '15@vs',
        flexDirection: 'row',
    },
    avatarBox: {
        flex: 1.5,
        justifyContent: 'center',
    },
    avatar: {
        width: '30@vs',
        height: '30@vs',
        borderWidth: 1,
        borderRadius: '15@vs',
    },
    nameBox: {
        flex: 4,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 20,
    },
    buttonCancelBox: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconCancel: {
        fontSize: 20,
    },
});

export default memo(UserBlocked);
