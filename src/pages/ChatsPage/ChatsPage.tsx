import { authStorage } from '../../auth/AuthStorage';
import ChatsSidebar from '../../components/ChatsSidebar';
import type { Chat } from '../../components/ChatsSidebar/types';
import { chatStorage } from '../../components/ChatsSidebar/chatsStorage';
import { useEffect, useState } from 'react';
import { greenApi } from '../../api/greenApi';
import ChatWindow from '../../components/ChatWindow';

import styles from './ChatsPage.module.scss';
import { notificationService } from '../../api/notificationService';
import NewChatModal from '../../components/NewChatModal';

interface ApiChat {
   chatId: string;
   name: string;
   type: Chat['type'];
   phoneNumber: number;
   username: string;
}

const ChatsPage = () => {
   const config = authStorage.get();

   const [chats, setChats] = useState<Chat[]>([]);
   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const idInstance = config?.idInstance;
   const apiTokenInstance = config?.apiTokenInstance;

   const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

   useEffect(() => {
      if (!config) return;

      notificationService.start(config);

      return () => {
         notificationService.stop();
      };
   }, [idInstance, apiTokenInstance, config]);

   useEffect(() => {
      if (!idInstance || !apiTokenInstance) {
         return;
      }

      const cancelled = false;

      const loadChats = async () => {
         try {
            setError(null);

            const response = await greenApi.getChats({
               idInstance,
               apiTokenInstance,
            });

            const apiChats: ApiChat[] = response.data;

            const formattedChats: Chat[] = apiChats.map((chat) => ({
               id: chat.chatId,
               name: chat.name || chat.username || chat.chatId,
               type: chat.type,
               phoneNumber: chat.phoneNumber,
               username: chat.username,
            }));

            if (cancelled) return;

            setChats(formattedChats);
            chatStorage.saveChats(formattedChats);

            setSelectedChatId((currentId) => {
               if (
                  currentId &&
                  formattedChats.some((chat) => chat.id === currentId)
               ) {
                  return currentId;
               }

               return formattedChats[0]?.id ?? null;
            });
         } catch (err) {
            if (cancelled) return;
            console.error('Failed to load chats:', err);
            setError('Не удалось загрузить чаты');
         } finally {
            if (!cancelled) {
               setIsLoading(false);
            }
         }
      };

      void loadChats();
   }, [idInstance, apiTokenInstance]);

   const handleOpenChatByPhone = async (phone: string) => {
      try {
         if (!config) {
            setError('Нет конфигурации авторизации. Войдите заново.');
            return;
         }

         const result = await greenApi.checkAccount(config, Number(phone));

         if (!result.exist || !result.chatId) {
            alert(
               'Telegram-аккаунт по этому номеру не найден или номер скрыт настройками приватности'
            );
            return;
         }

         const existingChat = chats.find((item) => item.id === result.chatId);

         if (existingChat) {
            setSelectedChatId(existingChat.id);
         } else {
            const newChat: Chat = {
               id: result.chatId,
               name: result.username || phone,
               type: 'user',
               phoneNumber: result.phoneNumber ?? Number(phone),
               username: result.username || null,
            };

            setChats((prev) => [...prev, newChat]);
            setSelectedChatId(result.chatId);
         }

         setIsNewChatModalOpen(false);
      } catch (error) {
         console.error('Ошибка проверки номера:', error);
         alert('Не удалось проверить номер. Попробуйте позже.');
      }
   };

   const selectedChat =
      chats.find((chat) => chat.id === selectedChatId) ?? null;

   if (!config) {
      return null;
   }

   if (isLoading) {
      return <div>Загрузка чатов...</div>;
   }

   return (
      <>
         <main>
            {error && (
               <div role="alert" className={styles.error}>
                  {error}. Проверьте подключение и попробуйте обновить список
                  позже.
               </div>
            )}
            <div className={styles.chatPageContainer}>
               <ChatsSidebar
                  onSelectChat={setSelectedChatId}
                  selectedChatId={selectedChatId}
                  chats={chats}
                  onNewChat={() => setIsNewChatModalOpen(true)}
               />
               <ChatWindow chat={selectedChat} config={config}></ChatWindow>
            </div>
         </main>
         {isNewChatModalOpen && (
            <NewChatModal
               onClose={() => setIsNewChatModalOpen(false)}
               onSubmit={handleOpenChatByPhone}
            />
         )}
      </>
   );
};

export default ChatsPage;
