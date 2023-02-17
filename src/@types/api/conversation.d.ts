interface TypeChatTagResponse {
  id: string;
  listUser: Array<TypeMemberInListChatTag>;
  conversationName: string;
  conversationImage: string;
  userData: {
    [key: string]: {
      created: string;
      modified: string;
    };
  };
  color: number;
  modified: string;
  status: number;
  isBlocked: boolean;
  latestMessage: string;
  // in front-end
  userTyping?: Array<number>;
}

interface TypeChatMessageResponse {
  id: string;
  conversationId: string;
  type: number;
  content: string | Array<string>;
  creator: number;
  creatorName: string;
  creatorAvatar: string;
  created: string | undefined;
  tag?: string | undefined; // to check message comeback sender after set local message
  // in front-end
  relationship: number;
}

interface TypeChangeChatColor {
  conversationId: string;
  color: number;
}

interface TypeChangeChatName {
  conversationId: string;
  name: string;
}
