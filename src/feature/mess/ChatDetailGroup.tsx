// /* eslint-disable no-restricted-syntax */
// import {useIsFocused} from '@react-navigation/native';
// import {TypeChatMessageResponse, TypeChatTagResponse} from 'api/interface';
// import {MESSAGE_TYPE} from 'asset/enum';
// import Images from 'asset/img/images';
// import {Metrics} from 'asset/metrics';
// import Theme from 'asset/theme/Theme';
// import {StyleImage, StyleText, StyleTouchable} from 'components/base';
// import StyleList from 'components/base/StyleList';
// import StyleKeyboardAwareView from 'components/StyleKeyboardAwareView';
// import ModalPickImage from 'feature/mess/components/ModalPickImage';
// import Redux from 'hook/useRedux';
// import {
//     agreePublicChat,
//     socketUnTyping,
//     useSocketChatDetail,
// } from 'hook/useSocketIO';
// import {MESS_ROUTE} from 'navigation/config/routes';
// import {
//     appAlertYesNo,
//     goBack,
//     navigate,
//     showSwipeImages,
// } from 'navigation/NavigationService';
// import React, {useEffect, useMemo, useRef, useState} from 'react';
// import {FlatList, Keyboard, TextInput, View} from 'react-native';
// import {moderateScale, ScaledSheet} from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import {chooseColorGradient, isIOS} from 'utility/assistant';
// import HeaderRequestPublic from './components/HeaderRequestPublic';
// import ItemMessageGroup from './components/ItemMessageGroup';
// import MessageEvent from './components/MessageEvent';
// import Typing from './components/Typing';
// import UserInput from './components/UserInput';

// interface ChatDetailProps {
//     route: {
//         params: {
//             itemChatTag: TypeChatTagResponse;
//             setListChatTags: any;
//         };
//     };
// }

// export interface MessageSeen {
//     userId: number;
//     avatar: string;
// }

// const initHeightModal = ((Metrics.width - 6) * 2) / 3;

// const ChatDetailGroup = ({route}: ChatDetailProps) => {
//     const {profile} = Redux.getPassport();
//     const theme = Redux.getTheme();
//     const listChatTag = Redux.getListChatTag();
//     const numberNewMessages = Redux.getNumberNewMessages();
//     const {gradient} = Redux.getResource();
//     const borderMessRoute = Redux.getBorderMessRoute();

//     const listRef = useRef<FlatList>(null);
//     const inputRef = useRef<TextInput>(null);
//     const isFocused = useIsFocused();

//     const [shouldNotiShh, setShouldNotiShh] = useState(false);
//     const [displayPickImg, setDisplayPickImg] = useState(false);
//     const [modalPickImgHeight, setModalPickImgHeight] =
//         useState(initHeightModal);

//     const [itemChatTag, setItemChatTag] = useState(route.params.itemChatTag);
//     const [messageSeen, setMessageSeen] = useState<{
//         [key: string]: Array<MessageSeen>;
//     }>({});

//     const {
//         messages,
//         deleteMessage,
//         sendMessage,
//         refreshing,
//         onRefresh,
//         onLoadMore,
//     } = useSocketChatDetail({
//         isMyChatTag: false,
//         setListChatTags: route.params.setListChatTags,
//     });

//     const [content, setContent] = useState('');
//     const [images, setImages] = useState([]);

//     const myAvatar = useMemo(() => {
//         for (let i = 0; i < itemChatTag.listUser.length; i++) {
//             if (profile.id === itemChatTag.listUser[i].id) {
//                 return itemChatTag.listUser[i].avatar;
//             }
//         }
//         return '';
//     }, []);

//     const chatColor = useMemo(() => {
//         const color = chooseColorGradient({
//             listGradients: gradient,
//             colorChoose: itemChatTag.color,
//         });
//         Redux.setBorderMessRoute(color[2]);
//         return color;
//     }, [itemChatTag.color]);

//     /**
//      * Agree, refuse request public
//      */
//     const onAgreeRequestPublic = () => {
//         goBack();
//         agreePublicChat(itemChatTag.id);
//         setItemChatTag({
//             ...itemChatTag,
//             isRequestingPublic: true,
//             hadRequestedPublic: true,
//         });
//     };

//     const onRefuseRequestPublic = () => {
//         const temp = listChatTag.map(item => {
//             if (item.id !== itemChatTag.id) {
//                 return item;
//             }
//             return {
//                 ...item,
//                 isRequestingPublic: false,
//             };
//         });
//         route.params.setListChatTags(temp);
//         goBack();
//     };

//     /**
//      * Effect
//      */
//     useEffect(() => {
//         for (let i = 0; i < listChatTag.length; i++) {
//             const temp = listChatTag[i];
//             if (temp.id === itemChatTag.id) {
//                 if (temp.isRequestingPublic) {
//                     setItemChatTag(temp);
//                     setShouldNotiShh(true);
//                 } else {
//                     setItemChatTag(temp);
//                     setShouldNotiShh(false);
//                 }
//                 break;
//             }
//         }
//     }, [listChatTag]);

//     // when having socket request public
//     useEffect(() => {
//         if (shouldNotiShh) {
//             appAlertYesNo({
//                 i18Title: 'mess.messScreen.requestPublic',
//                 agreeChange: onAgreeRequestPublic,
//                 refuseChange: onRefuseRequestPublic,
//                 headerNode: <HeaderRequestPublic itemChatTag={itemChatTag} />,
//                 touchOutBack: false,
//             });
//         }
//         // else {
//         //     setItemChatTag({...itemChatTag, isRequestingPublic: false});
//         // }
//     }, [shouldNotiShh]);

//     useEffect(() => {
//         if (!isFocused) {
//             socketUnTyping({
//                 chatTagId: itemChatTag.id,
//                 userId: profile.id,
//             });
//         }
//     }, [isFocused]);

//     const choosingAvatar = (userId: number) => {
//         const checkUser = itemChatTag.listUser.find(item => item.id === userId);
//         return checkUser?.avatar || '';
//     };

//     useEffect(() => {
//         const temp: {[key: string]: Array<MessageSeen>} = {};
//         const {userSeenMessage} = itemChatTag;
//         for (const [key, value] of Object.entries(userSeenMessage)) {
//             if (value.latestMessage) {
//                 if (temp?.[value.latestMessage]) {
//                     temp[value.latestMessage].push({
//                         userId: Number(key),
//                         avatar: choosingAvatar(Number(key)),
//                     });
//                 } else {
//                     temp[value.latestMessage] = [];
//                     temp[value.latestMessage].push({
//                         userId: Number(key),
//                         avatar: choosingAvatar(Number(key)),
//                     });
//                 }
//             }
//         }

//         setMessageSeen(temp);
//     }, [itemChatTag]);

//     /**
//      * Send message
//      */
//     const onSend = async () => {
//         const senderName = itemChatTag.isPrivate
//             ? profile.anonymousName
//             : profile.name;

//         if (profile?.id) {
//             // send images
//             if (images.length) {
//                 setImages([]);
//                 await sendMessage({
//                     chatTag: itemChatTag.id,
//                     groupName: itemChatTag.groupName,
//                     type: MESSAGE_TYPE.image,
//                     content: images,
//                     senderId: profile.id,
//                     senderName,
//                     senderAvatar: myAvatar,
//                     listUser: itemChatTag.listUser.map(item => item.id),
//                     tag: String(Date.now()),
//                 });
//             }

//             // send text
//             if (content) {
//                 setContent('');
//                 await sendMessage({
//                     chatTag: itemChatTag.id,
//                     groupName: itemChatTag.groupName,
//                     type: MESSAGE_TYPE.text,
//                     content: content.trimEnd(),
//                     senderId: profile.id,
//                     senderName,
//                     senderAvatar: myAvatar,
//                     listUser: itemChatTag.listUser.map(item => item.id),
//                     tag: String(Date.now()),
//                 });
//             }
//         }

//         listRef.current?.scrollToOffset({offset: 0});
//     };

//     /**
//      * Go to setting chat
//      */
//     const onNavigateToMessSetting = () => {
//         navigate(MESS_ROUTE.chatDetailSetting, {
//             itemChatTag,
//         });
//     };

//     const onDeleteImage = (index: number) => {
//         const temp = [...images];
//         temp.splice(index, 1);
//         setImages(temp);
//     };

//     const onGoBack = () => {
//         Redux.setChatTagFocusing('');
//         goBack();
//     };

//     const onSeeDetailImage = (listImages: Array<any>, index: number) => {
//         if (inputRef.current?.isFocused() && !isIOS) {
//             Keyboard.dismiss();
//             const x = setTimeout(() => {
//                 showSwipeImages({
//                     listImages,
//                     initIndex: index,
//                 });
//             }, 100);
//             return () => clearTimeout(x);
//         }

//         showSwipeImages({
//             listImages,
//             initIndex: index,
//         });
//         return () => null;
//     };

//     /**
//      * Render view
//      */
//     const RenderHeader = () => {
//         const headerLeft = () => {
//             return (
//                 <View style={styles.headerLeftBox}>
//                     <AntDesign
//                         name="left"
//                         style={[styles.iconLeft, {color: borderMessRoute}]}
//                     />
//                     {!!numberNewMessages && (
//                         <View
//                             style={[
//                                 styles.numberNewMessagesBox,
//                                 {backgroundColor: borderMessRoute},
//                             ]}>
//                             <StyleText
//                                 originValue={numberNewMessages}
//                                 customStyle={[
//                                     styles.textNewMessages,
//                                     {color: Theme.common.textMe},
//                                 ]}
//                             />
//                         </View>
//                     )}
//                 </View>
//             );
//         };

//         const headerShh = () => {
//             return (
//                 <AntDesign
//                     name="team"
//                     style={{
//                         fontSize: moderateScale(17),
//                         color: borderMessRoute,
//                     }}
//                 />
//             );
//         };

//         const headerOption = () => {
//             return (
//                 <AntDesign
//                     name="infocirlceo"
//                     style={[styles.iconCloud, {color: borderMessRoute}]}
//                 />
//             );
//         };

//         // const HeaderBoxCloud = useMemo(() => {
//         //     return (
//         //         <Feather
//         //             name="cloud-snow"
//         //             style={[styles.iconCloud, {color: theme.textColor}]}
//         //         />
//         //     );
//         // }, []);

//         return (
//             // <Header
//             //     headerTitle={itemChatTag.groupName}
//             //     headerLeft={headerLeft()}
//             //     headerLeftMission={onGoBack}
//             //     headerRight2={headerShh()}
//             //     headerRight3={headerOption()}
//             //     headerRight3Mission={onNavigateToMessSetting}
//             //     containerStyle={{
//             //         borderBottomColor: borderMessRoute,
//             //         height: verticalScale(45),
//             //     }}
//             //     headerTitleStyle={{
//             //         color: borderMessRoute,
//             //     }}
//             // />
//             null
//         );
//     };

//     const RenderItemMessage = (params: {
//         item: TypeChatMessageResponse;
//         index: number;
//     }) => {
//         const {item, index} = params;
//         const isSameMessageAfter =
//             messages?.[index + 1]?.relationship === item.relationship;
//         const displayPartnerAvatar =
//             messages[index - 1]?.relationship !== item.relationship;
//         const listUserSeen = messageSeen[item.id] || [];

//         if (item.type === MESSAGE_TYPE.joinCommunity) {
//             return (
//                 <MessageEvent
//                     creatorName={item.content}
//                     i18Content="mess.hadJoinGroup"
//                 />
//             );
//         }

//         return (
//             <ItemMessageGroup
//                 itemMessage={item}
//                 isSameMessageAfter={isSameMessageAfter}
//                 displayPartnerAvatar={displayPartnerAvatar}
//                 listUsersSeen={listUserSeen}
//                 onDeleteMessage={deleteMessage}
//                 listMessagesLength={messages.length}
//                 chatColor={chatColor}
//                 onSeeDetailImage={onSeeDetailImage}
//             />
//         );
//     };

//     const RenderTyping = useMemo(() => {
//         if (!itemChatTag?.userTyping || !itemChatTag?.userTyping.length) {
//             return null;
//         }

//         const listAvatarsDisplay: Array<string> = [];
//         itemChatTag.userTyping.forEach(userId => {
//             if (userId === profile.id) {
//                 return;
//             }
//             const avatar = itemChatTag.listUser.find(
//                 item => item.id === userId,
//             )?.avatar;
//             if (avatar) {
//                 listAvatarsDisplay.push(avatar);
//             }
//         });

//         return (
//             <>
//                 {listAvatarsDisplay.map((avatar, index) => (
//                     <Typing key={index} avatar={avatar} isMyChatTag={false} />
//                 ))}
//             </>
//         );
//     }, [itemChatTag?.userTyping]);

//     const RenderListMessage = () => {
//         return (
//             <View style={{flex: 1}}>
//                 <StyleList
//                     ref={listRef}
//                     data={messages}
//                     renderItem={RenderItemMessage}
//                     contentContainerStyle={styles.contentContainer}
//                     inverted
//                     keyExtractor={item => item.id}
//                     refreshing={refreshing}
//                     onRefresh={onRefresh}
//                     onLoadMore={onLoadMore}
//                     ListHeaderComponent={RenderTyping}
//                 />
//             </View>
//         );
//     };

//     const RenderImagePreview = useMemo(() => {
//         if (images.length) {
//             return (
//                 <View style={styles.twoImageInput}>
//                     {images.map((item, index) => (
//                         <View style={styles.imageInputView} key={index}>
//                             {/* image */}
//                             <StyleImage
//                                 key={index}
//                                 source={{uri: item}}
//                                 customStyle={styles.imageInput}
//                             />

//                             {/* button delete */}
//                             <StyleTouchable
//                                 customStyle={[
//                                     styles.deleteImageBox,
//                                     {
//                                         backgroundColor: theme.borderColor,
//                                     },
//                                 ]}
//                                 onPress={() => onDeleteImage(index)}>
//                                 <Feather
//                                     name="x"
//                                     style={[
//                                         styles.iconDeleteImage,
//                                         {color: theme.backgroundColor},
//                                     ]}
//                                 />
//                             </StyleTouchable>
//                         </View>
//                     ))}
//                 </View>
//             );
//         }
//         return null;
//     }, [images]);

//     const RenderStopOrBlock = useMemo(() => {
//         if (itemChatTag.isStop || itemChatTag.isBlock) {
//             return (
//                 <View style={styles.blockView}>
//                     <StyleImage
//                         source={Images.images.squirrelEnjoy}
//                         customStyle={styles.blockImage}
//                     />
//                 </View>
//             );
//         }
//         return null;
//     }, [itemChatTag.isStop, itemChatTag.isBlock]);

//     const RenderPickImage = useMemo(() => {
//         if (displayPickImg) {
//             return (
//                 <ModalPickImage
//                     images={images}
//                     setImages={setImages}
//                     containerStyle={{
//                         height: modalPickImgHeight,
//                         backgroundColor: theme.backgroundColor,
//                     }}
//                 />
//             );
//         }
//         return null;
//     }, [displayPickImg, images, modalPickImgHeight]);

//     return (
//         <>
//             <StyleKeyboardAwareView
//                 containerStyle={{backgroundColor: theme.backgroundColor}}
//                 onGetKeyBoardHeight={(value: number) =>
//                     setModalPickImgHeight(value - Metrics.safeBottomPadding)
//                 }>
//                 {RenderHeader()}
//                 {RenderListMessage()}
//                 {RenderImagePreview}
//                 {RenderStopOrBlock}
//                 {!(itemChatTag.isStop || itemChatTag.isBlock) && (
//                     <UserInput
//                         ref={inputRef}
//                         text={content}
//                         setText={(text: string) => setContent(text)}
//                         onSendMessage={onSend}
//                         images={images}
//                         setImages={setImages}
//                         displayPickImg={displayPickImg}
//                         setDisplayPickImg={setDisplayPickImg}
//                     />
//                 )}
//             </StyleKeyboardAwareView>

//             {RenderPickImage}
//         </>
//     );
// };

// const styles = ScaledSheet.create({
//     contentContainer: {
//         flexGrow: 1,
//         paddingBottom: '30@vs',
//     },
//     contentPart: {
//         flex: 1,
//     },
//     iconCloud: {
//         fontSize: '17@ms',
//     },
//     headerLeftBox: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     iconLeft: {
//         fontSize: '20@ms',
//     },
//     numberNewMessagesBox: {
//         width: '13@s',
//         height: '15@s',
//         borderRadius: '10@s',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     textNewMessages: {
//         fontSize: '11@ms',
//     },
//     // two image when choose send image
//     twoImageInput: {
//         width: '100%',
//         height: '75@vs',
//         paddingTop: '15@vs',
//         paddingHorizontal: '20@s',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     imageInputView: {
//         width: '47%',
//         height: '100%',
//     },
//     imageInput: {
//         width: '100%',
//         height: '100%',
//         borderRadius: '5@vs',
//     },
//     // icon blocked
//     blockView: {
//         width: '100%',
//         alignItems: 'center',
//         paddingVertical: '20@vs',
//     },
//     blockImage: {
//         width: '50@s',
//         height: '50@s',
//         resizeMode: 'contain',
//     },
//     deleteImageBox: {
//         position: 'absolute',
//         padding: '3@s',
//         right: '-8@s',
//         top: '-6@s',
//         borderRadius: '10@s',
//     },
//     iconDeleteImage: {
//         fontSize: '13@ms',
//     },
// });

// export default ChatDetailGroup;

import React from 'react';
import {Text, View} from 'react-native';

const ChatDetailGroup = () => {
    return (
        <View>
            <Text>ChatDetailGroup</Text>
        </View>
    );
};

export default ChatDetailGroup;
