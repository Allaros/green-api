export interface Chat {
   id: string;
   name: string;
   type: 'user' | 'group' | 'supergroup' | 'channel' | 'bot';
   phoneNumber?: number | null;
   username?: string | null;
}

export interface ChatSidebarProps {
   chats: Chat[];
   selectedChatId: string | null;
   onSelectChat: (chatId: string) => void;
   onNewChat: () => void;
}
