import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface ListSaveAccProps {
    listAcc: Array<any>;
    selectAcc(index: any): any;
    deleteAcc(index: any): any;
}

const ModuleTagAcc = (props: any) => {
    const {index, indexAcc, onSelectAcc, onDeleteAcc} = props;

    return (
        <StyleTouchable
            customStyle={styles.moduleAcc}
            onPress={() => onSelectAcc(index)}>
            <View style={styles.iconBox}>
                <StyleIcon source={Images.images.logo} size={14} />
            </View>

            <View style={styles.usernameBox}>
                <StyleText
                    originValue={indexAcc.username}
                    customStyle={styles.textUsername}
                />
            </View>

            <StyleTouchable
                style={styles.deleteAccBox}
                onPress={() => onDeleteAcc(index)}>
                <Feather name="x" style={styles.iconCancel} />
            </StyleTouchable>
        </StyleTouchable>
    );
};

/**
 *  BOSS HERE
 */
const ListSaveAcc = (props: ListSaveAccProps) => {
    const {listAcc, selectAcc, deleteAcc} = props;

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
            {listAcc.map((item, index) => (
                <ModuleTagAcc
                    key={index}
                    index={index}
                    indexAcc={item}
                    onSelectAcc={selectAcc}
                    onDeleteAcc={deleteAcc}
                />
            ))}
        </ScrollView>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        maxHeight: '200@vs',
        position: 'absolute',
        paddingBottom: '20@vs',
        top: '95@vs',
        alignSelf: 'center',
        backgroundColor: Theme.darkTheme.backgroundColor,
    },
    moduleAcc: {
        width: '100%',
        height: '40@vs',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '8@vs',
        paddingHorizontal: '20@vs',
        borderBottomWidth: 0.3,
        borderColor: Theme.darkTheme.borderColor,
    },
    iconBox: {
        width: '30@vs',
        height: '30@vs',
        borderRadius: '20@vs',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Theme.darkTheme.highlightColor,
    },
    usernameBox: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '10@vs',
    },
    deleteAccBox: {
        width: '35@vs',
        height: '35@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCancel: {
        fontSize: '17@ms',
        color: Theme.darkTheme.borderColor,
    },
    textUsername: {
        fontSize: '13@ms',
        color: Theme.darkTheme.textHightLight,
    },
});

export default ListSaveAcc;
