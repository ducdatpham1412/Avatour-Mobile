import {TOPIC} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, LIST_TOPICS} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleIcon,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    topics: Array<number>;
    onChangeListTopics(value: Array<number>): void;
}

const {width, height} = Metrics;

const IconChoose = ({item, textColor, isChosen}: any) => {
    const aim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isChosen) {
            Animated.spring(aim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(aim, {
                toValue: 0.7,
                useNativeDriver: true,
            }).start();
        }
    }, [isChosen]);

    return (
        <Animated.View
            style={[
                styles.topicTouch,
                {transform: [{scale: aim}], opacity: aim},
            ]}>
            <StyleIcon source={item.icon} size={40} />
            <StyleText
                i18Text={item.text}
                customStyle={[styles.textFeeling, {color: textColor}]}
            />
        </Animated.View>
    );
};

const ModalTopic = (props: Props, ref: any) => {
    const {onChangeListTopics, topics} = props;
    const theme = Redux.getTheme();

    const [tempTopics, setTempTopics] = useState(topics);
    const [showWarning, setShowWarning] = useState(false);
    const timeOut = useRef<any>(null);

    const onChoose = (topicId: any) => {
        if (tempTopics.includes(topicId)) {
            setTempTopics(tempTopics.filter(id => id !== topicId));
        } else if (tempTopics.length === 3) {
            setShowWarning(true);
            timeOut.current = setTimeout(() => {
                setShowWarning(false);
            }, 2000);
        } else {
            setTempTopics(tempTopics.concat(topicId));
        }
        return () => clearTimeout(timeOut.current);
    };

    const onSave = () => {
        onChangeListTopics(tempTopics);
        ref.current.close();
    };

    const onClose = () => {
        setTempTopics(topics);
        ref.current.close();
    };

    return (
        <Modalize
            ref={ref}
            modalStyle={styles.modal}
            withHandle={false}
            overlayStyle={{
                backgroundColor: theme.backgroundOpacity(),
            }}>
            <View
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <ButtonX
                    containerStyle={styles.buttonClose}
                    onPress={onClose}
                />
                <StyleText
                    i18Text="profile.post.topic"
                    customStyle={[styles.title, {color: theme.textColor}]}
                />
                <View style={styles.topicView}>
                    {LIST_TOPICS.map(item => {
                        if (item.id === TOPIC.all) {
                            return null;
                        }
                        return (
                            <StyleTouchable
                                key={item.id}
                                customStyle={styles.topicBox}
                                onPress={() => onChoose(item.id)}>
                                <IconChoose
                                    item={item}
                                    textColor={theme.textColor}
                                    isChosen={tempTopics.includes(item.id)}
                                />
                            </StyleTouchable>
                        );
                    })}
                </View>

                <View style={styles.warningView}>
                    {showWarning && (
                        <StyleText
                            i18Text="alert.canChooseMaximum3"
                            customStyle={styles.textWarning}
                        />
                    )}
                </View>

                <StyleButton
                    title="common.save"
                    onPress={onSave}
                    containerStyle={styles.buttonView}
                />
            </View>
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: width * 0.9,
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        marginTop: height * 0.1,
        alignSelf: 'center',
        borderRadius: '7@ms',
        alignItems: 'center',
    },
    buttonClose: {
        position: 'absolute',
        top: '7@s',
        right: '7@s',
    },
    title: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    topicView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '10@vs',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    topicBox: {
        width: (width * 0.9) / 4,
        paddingVertical: '10@vs',
    },
    topicTouch: {
        flex: 1,
        alignItems: 'center',
    },
    textFeeling: {
        fontSize: '8@ms',
        marginTop: '10@vs',
    },
    warningView: {
        width: '100%',
        alignItems: 'center',
        height: '20@ms',
    },
    textWarning: {
        fontSize: FONT_SIZE.tiny,
        color: Theme.common.red,
    },
    buttonView: {
        paddingVertical: '8@vs',
        marginTop: '10@vs',
    },
});

export default forwardRef(ModalTopic);
