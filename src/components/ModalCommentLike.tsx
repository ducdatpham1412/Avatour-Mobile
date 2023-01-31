import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {Metrics} from 'asset/metrics';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import ListComments from 'components/ListComments';
import ListReacts from 'components/ListReacts';
import StyleTabView from 'components/StyleTabView';
import React, {Component} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    theme: TypeTheme;
    bubbleFocusing: TypeBubblePalace | TypeGroupBuying;
    updateBubbleFocusing(value: TypeBubblePalace | TypeGroupBuying): void;
    setTotalComments(value: number): void;
    increaseTotalComments(value: number): void;
    inputCommentContainerStyle?: StyleProp<ViewStyle>;
    extraHeight?: number;
}

export interface TypeModalCommentPost {
    post: TypeBubblePalace | TypeGroupBuying;
    setList?: Function;
    type: TypeShowModalCommentOrLike;
}

interface States {
    tabIndex: number;
}

const commentModalHeight = (Metrics.height * 2) / 2.7;

class ModalCommentLike extends Component<Props> {
    modalRef = React.createRef<Modalize>();

    tabViewRef = React.createRef<StyleTabView>();

    state: States = {
        tabIndex: 0,
    };

    preNumberComments = 0;

    setList: Function | undefined = undefined;

    show(params: TypeModalCommentPost) {
        this.props.updateBubbleFocusing(params.post);
        this.preNumberComments = params.post.totalComments;
        if (params.setList) {
            this.setList = params.setList;
        }
        this.setState(
            {
                tabIndex: params.type === 'comment' ? 0 : 1,
            },
            () => {
                this.modalRef.current?.open();
            },
        );
    }

    private onCloseModal() {
        if (
            this.preNumberComments !== this.props.bubbleFocusing.totalComments
        ) {
            if (this.setList) {
                this.setList(
                    (preValue: Array<TypeBubblePalace | TypeGroupBuying>) => {
                        return preValue.map(item => {
                            if (item.id !== this.props.bubbleFocusing.id) {
                                return item;
                            }
                            return {
                                ...item,
                                totalComments:
                                    this.props.bubbleFocusing.totalComments,
                            };
                        });
                    },
                );
            }
        }
    }

    render() {
        const {
            theme,
            bubbleFocusing,
            updateBubbleFocusing,
            increaseTotalComments,
            setTotalComments,
            inputCommentContainerStyle,
            extraHeight,
        } = this.props;
        const {tabIndex} = this.state;

        return (
            <Modalize
                ref={this.modalRef}
                withHandle={false}
                onClose={() => this.onCloseModal()}
                modalHeight={commentModalHeight}
                modalStyle={{
                    backgroundColor: 'transparent',
                }}
                overlayStyle={{
                    backgroundColor: theme.backgroundOpacity(0.3),
                }}
                scrollViewProps={{
                    keyboardShouldPersistTaps: 'handled',
                    nestedScrollEnabled: true,
                }}>
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.backgroundColor,
                        },
                    ]}>
                    <View style={styles.headerTouch}>
                        <StyleText
                            i18Text="discovery.numberComments"
                            i18Params={{
                                numberComments: bubbleFocusing.totalComments,
                            }}
                            customStyle={[
                                styles.textNumberComments,
                                {
                                    color: theme.textColor,
                                    opacity: tabIndex === 0 ? 1 : 0.6,
                                },
                            ]}
                            onPress={() =>
                                this.tabViewRef.current?.navigateToIndex(0)
                            }
                        />
                        <StyleText
                            i18Text="discovery.numberLike"
                            i18Params={{
                                value: bubbleFocusing.totalLikes,
                            }}
                            customStyle={[
                                styles.textNumberLikes,
                                {
                                    color: theme.textColor,
                                    opacity: tabIndex === 1 ? 1 : 0.6,
                                },
                            ]}
                            onPress={() =>
                                this.tabViewRef.current?.navigateToIndex(1)
                            }
                        />
                        <StyleTouchable
                            customStyle={styles.iconTurnOffTouch}
                            onPress={() => this.modalRef.current?.close()}
                            hitSlop={15}>
                            <Feather
                                name="x"
                                style={[
                                    styles.iconTurnOff,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>

                    <View style={{flex: 1}}>
                        <StyleTabView
                            ref={this.tabViewRef}
                            containerStyle={styles.tabContainer}
                            initIndex={this.state.tabIndex}
                            onScroll={e => {
                                if (e.index !== tabIndex) {
                                    this.setState({
                                        tabIndex: e.index,
                                    });
                                }
                            }}>
                            <ListComments
                                bubbleFocusing={bubbleFocusing}
                                setTotalComments={setTotalComments}
                                increaseTotalComments={increaseTotalComments}
                                inputCommentContainerStyle={
                                    inputCommentContainerStyle
                                }
                                extraHeight={extraHeight}
                            />
                            <ListReacts
                                postId={bubbleFocusing.id}
                                updateBubbleFocusing={updateBubbleFocusing}
                            />
                        </StyleTabView>
                    </View>
                </View>
            </Modalize>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: commentModalHeight,
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
    },
    // header
    headerTouch: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '2@vs',
    },
    textNumberComments: {
        fontSize: '13@ms',
        marginLeft: '20@s',
        paddingVertical: '5@vs',
    },
    textNumberLikes: {
        fontSize: '13@ms',
        marginLeft: '25@s',
        paddingVertical: '5@vs',
    },
    iconTurnOffTouch: {
        position: 'absolute',
        right: '10@s',
    },
    iconTurnOff: {
        fontSize: '20@ms',
    },
    // list comment
    tabContainer: {
        height: '100%',
    },
});

export default ModalCommentLike;
