/* eslint-disable react-hooks/exhaustive-deps */
import styles from './chatWindow.module.scss';
import type { Chat } from '../ChatsSidebar/types';
import Avatar from '../Avatar';
import ChatForm from '../ChatForm';
import { greenApi } from '../../api/greenApi';
import type { GreenApiConfig } from '../../api/types/greenApiTypes';
import { useEffect, useState } from 'react';
import type { ChatMessage } from './types';
import { authStorage } from '../../auth/AuthStorage';
import { notificationService } from '../../api/notificationService';
const ChatWindow = ({
   chat,
   config,
}: {
   chat: Chat | null;
   config: GreenApiConfig;
}) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleSend = async (message: string) => {
      if (!chat || !message.trim()) return;

      const tempId = `temp-${Date.now()}`;
      const text = message.trim();

      const optimisticMessage: ChatMessage = {
         idMessage: tempId,
         chatId: chat.id,
         type: 'outgoing',
         typeMessage: 'textMessage',
         timestamp: Math.floor(Date.now() / 1000),
         textMessage: text,
         statusMessage: 'pending',
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      try {
         await greenApi.sendMessage(config, {
            chatId: chat.id,
            message: text,
            typingTime: 2000,
         });
      } catch (error) {
         console.error('Ошибка отправки сообщения:', error);

         setMessages((prev) =>
            prev.filter((item) => item.idMessage !== tempId)
         );

         return;
      }

      // Обновляем историю отдельно от отправки.
      try {
         const history = await greenApi.getChatHistory(config, {
            chatId: chat.id,
            count: 100,
         });

         setMessages((prev) => {
            const serverMessages = [...history].reverse();

            // Если API ещё не вернуло отправленное сообщение,
            // оставляем optimistic-сообщение на экране.
            const messageExists = serverMessages.some(
               (item) => item.textMessage === text && item.type === 'outgoing'
            );

            if (messageExists) {
               return serverMessages;
            }

            return [
               ...serverMessages.filter((item) => item.idMessage !== tempId),
               ...prev.filter((item) => item.idMessage === tempId),
            ];
         });
      } catch (error) {
         console.error('Не удалось обновить историю:', error);
         // Не удаляем сообщение: отправка уже прошла успешно.
      }
   };

   useEffect(() => {
      if (!chat) return;

      return notificationService.subscribe((message) => {
         if (message.chatId !== chat.id) return;

         setMessages((prev) => {
            if (prev.some((item) => item.idMessage === message.idMessage)) {
               return prev;
            }

            return [...prev, message].sort((a, b) => a.timestamp - b.timestamp);
         });
      });
   }, [chat?.id]);

   useEffect(() => {
      if (!chat) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setMessages([]);
         return;
      }

      let cancelled = false;

      const loadMessages = async () => {
         setIsLoading(true);
         setError(null);

         try {
            const config = authStorage.get();

            if (!config) {
               throw new Error('Не найдены данные авторизации');
            }

            const history = await greenApi.getChatHistory(config, {
               chatId: chat.id,
               count: 100,
            });

            if (!cancelled) {
               // API возвращает историю от новых сообщений к старым.
               setMessages(history.reverse());
            }
         } catch {
            if (!cancelled) {
               setError('Не удалось загрузить историю сообщений');
               setMessages([]);
            }
         } finally {
            if (!cancelled) {
               setIsLoading(false);
            }
         }
      };

      void loadMessages();

      return () => {
         cancelled = true;
      };
   }, [chat?.id]);

   if (!chat) {
      return (
         <section>
            <p>Выберите чат, чтобы начать общение</p>
         </section>
      );
   }

   return (
      <div className={styles.chatWindow}>
         <div className={`${styles.chatHeader} ${!chat ? styles.hide : ''}`}>
            <Avatar name={chat.name ?? ''} size="lg" />
            <div className={styles.info}>
               <p>{chat.name ?? ''}</p>
               <p className={styles.lowerText}>{chat.phoneNumber}</p>
            </div>
         </div>
         <div className={styles.messages}>
            {isLoading && <p>Загрузка сообщений...</p>}

            {error && <p role="alert">{error}</p>}

            {!isLoading && !error && messages.length === 0 && (
               <p>Сообщений пока нет</p>
            )}

            {messages.map((message) => (
               <div
                  key={message.idMessage}
                  className={
                     message.type === 'outgoing'
                        ? styles.outgoingMessage
                        : styles.incomingMessage
                  }
               >
                  {message.type === 'incoming' && message.senderName && (
                     <span className={styles.senderName}>
                        {message.senderName}
                     </span>
                  )}

                  <p>
                     {message.textMessage || 'Неподдерживаемый тип сообщения'}
                  </p>

                  <time>
                     {new Date(message.timestamp * 1000).toLocaleTimeString(
                        'ru-RU',
                        {
                           hour: '2-digit',
                           minute: '2-digit',
                        }
                     )}
                  </time>
               </div>
            ))}
         </div>
         <div>
            <ChatForm onSend={handleSend} />
         </div>
      </div>
   );
};

export default ChatWindow;
