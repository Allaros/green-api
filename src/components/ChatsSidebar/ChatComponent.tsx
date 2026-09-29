import type { Chat } from './types';
import styles from './chatSidebar.module.scss';
import Avatar from '../Avatar';
const ChatComponent = ({
   chat,
   onSelectChat,
   selectedChatId,
}: {
   chat: Chat;
   selectedChatId: string | null;
   onSelectChat: (chatId: string) => void;
}) => {
   return (
      <li className="">
         <button
            onClick={() => onSelectChat(chat.id)}
            className={`${styles.chat} ${selectedChatId === chat.id ? styles.activeChat : ''}`}
         >
            <Avatar name={chat.name} size="lg" />

            <div className={styles.chatName}>{chat.name}</div>
         </button>
      </li>
   );
};

export default ChatComponent;
