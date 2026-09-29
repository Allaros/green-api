import ChatComponent from './ChatComponent';
import type { ChatSidebarProps } from './types';
import styles from './chatSidebar.module.scss';

const ChatsSidebar = ({
   chats,
   onSelectChat,
   selectedChatId,
   onNewChat,
}: ChatSidebarProps) => {
   return (
      <aside className={styles.sidebar}>
         <div className={styles.title}>
            <h2>Чаты</h2>
         </div>
         <ul className={styles.chatBlock}>
            {chats.map((chat) => (
               <ChatComponent
                  key={chat.id}
                  chat={chat}
                  onSelectChat={onSelectChat}
                  selectedChatId={selectedChatId}
               />
            ))}
         </ul>
         <div className={styles.createChatButton}>
            <button onClick={onNewChat} className={styles.newChatButton}>
               <span>Новый чат</span>
               <img src="/Add.svg" alt="Add chat" />
            </button>
         </div>
      </aside>
   );
};

export default ChatsSidebar;
