import {apiGetDetailConversation} from 'api/conversation';
import {TypeChatTagResponse} from 'api/interface';
import {useAppSelector} from 'app-redux/store';
import {SafeView} from 'components/base';
import StyleList from 'components/base/StyleList';
import {useSocketConversations} from 'hook/sockets';
import Redux from 'hook/useRedux';
import {navigate} from 'navigation/NavigationService';
import {StyleHeader} from 'navigation/components';
import ROOT_SCREEN from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React, {memo, useCallback, useEffect} from 'react';
import {isTimeBefore} from 'utility/format';
import ChatTag from './components/ChatTag';

const RenderMessages = () => {
  const {chatTagFromNotification} = useAppSelector(state => state.logicSlice);
  const myId = useAppSelector(state => state.accountSlice.passport.profile.id);

  const [
    {
      listChatTags,
      seenMessage,
      onRefresh,
      refreshing,
      onLoadMore,
      setListChatTags,
    },
  ] = useSocketConversations();

  const goToChatDetailFromNotification = async () => {
    if (chatTagFromNotification) {
      try {
        Redux.setChatTagFocusing(chatTagFromNotification);
        const res = await apiGetDetailConversation(chatTagFromNotification);
        seenMessage(chatTagFromNotification);

        navigate(ROOT_SCREEN.chatDetail, {
          itemChatTag: res.data,
          setListChatTags,
        });

        Redux.setChatTagFromNotification(undefined);
        setListChatTags((preValue: Array<TypeChatTagResponse>) => {
          const check = preValue.find(
            item => item.id === chatTagFromNotification,
          );
          if (check) {
            return preValue;
          }
          return [res.data].concat(preValue);
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    }
  };

  useEffect(() => {
    goToChatDetailFromNotification();
  }, [chatTagFromNotification]);

  const onGoToChat = async (conversation: TypeChatTagResponse) => {
    try {
      const havingUpdate = isTimeBefore(
        conversation.userData[String(myId)].modified,
        conversation.modified,
      );
      if (havingUpdate) {
        seenMessage(conversation.id);
      }
      Redux.setChatTagFocusing(conversation.id);
      navigate(ROOT_SCREEN.chatDetail, {
        itemChatTag: conversation,
        setListChatTags,
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  /**
   * Render view
   */

  const renderChatTag = useCallback((item: TypeChatTagResponse) => {
    return <ChatTag item={item} onGoToChat={onGoToChat} />;
  }, []);

  return (
    <StyleList
      data={listChatTags}
      renderItem={({item}) => {
        return renderChatTag(item);
      }}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
    />
  );
};

/**
 * Boss here
 */
const MessScreen = () => {
  const {
    accountSlice: {modeExp},
    logicSlice: {borderMessRoute},
  } = useAppSelector(state => state);

  return (
    <SafeView>
      <StyleHeader title="mess.messScreen.headerTitle" />
    </SafeView>
  );
};

export default memo(MessScreen);
