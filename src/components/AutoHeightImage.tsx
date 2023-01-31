import React, {Component} from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import {StyleImage} from './base';

interface Props {
    uri: string;
    customStyle?: StyleProp<ImageStyle>;
}

interface States {
    ratio: number;
    checkWidth: number;
}

class AutoHeightImage extends Component<Props, States> {
    state: States = {
        ratio: 0,
        checkWidth: 0,
    };

    constructor(props: Props) {
        super(props);
        Image.getSize(this.props.uri, (width, height) => {
            this.setState({
                ratio: height / width,
            });
        });
    }

    render() {
        const {uri, customStyle} = this.props;
        const {ratio, checkWidth} = this.state;
        const checkHeight = checkWidth * ratio;

        return (
            <StyleImage
                source={{uri}}
                customStyle={[{height: checkHeight}, customStyle]}
                onLayout={e =>
                    this.setState({checkWidth: e.nativeEvent.layout.width})
                }
            />
        );
    }
}

export default AutoHeightImage;
