import AutoHeightImage from 'components/AutoHeightImage';
import React from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const TempText = ({value}: any) => {
    return <Text style={styles.text}>{value}</Text>;
};

const UpdatingScreen = () => {
    return (
        <View style={styles.container}>
            <TempText
                value="Hiện tại Doffy đang phát triển tính năng mới mang tên 'Lướt và bắt' nên xin
                phép tạm dừng một chút nhaaa ☺️"
            />
            <TempText value="Và đừng quên bật thông báo với Doffy" />
            <TempText value="Chúng mình sẽ quay trở lại sớm thôii!" />

            <AutoHeightImage
                uri="https://doffy-production.s3.ap-southeast-1.amazonaws.com/image/__admin_successful.png"
                customStyle={{width: '60%'}}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '20@s',
    },
    text: {
        fontSize: '20@ms',
        textAlign: 'center',
        marginVertical: '10@vs',
    },
});

export default UpdatingScreen;
