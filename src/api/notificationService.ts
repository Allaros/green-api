import { greenApi } from './greenApi';
import type {
   GreenApiConfig,
   GreenApiNotification,
} from './types/greenApiTypes';
import type { ChatMessage } from '../components/ChatWindow/types';

type Listener = (message: ChatMessage) => void;

const listeners = new Set<Listener>();

// Текущая конфигурация, с которой должен работать сервис.
let activeConfig: GreenApiConfig | null = null;

// Не допускаем параллельного запуска нескольких циклов.
let loopPromise: Promise<void> | null = null;

const sleep = (ms: number) =>
   new Promise<void>((resolve) => setTimeout(resolve, ms));

const notifyListeners = (message: ChatMessage) => {
   listeners.forEach((listener) => {
      try {
         listener(message);
      } catch (error) {
         console.error('Ошибка обработчика уведомления:', error);
      }
   });
};

const processNotification = (notification: GreenApiNotification): void => {
   const { body } = notification;

   const isIncoming = body.typeWebhook === 'incomingMessageReceived';

   const isOutgoing =
      body.typeWebhook === 'outgoingAPIMessageReceived' ||
      body.typeWebhook === 'outgoingMessageReceived';

   if (!isIncoming && !isOutgoing) return;

   const chatId = body.senderData?.chatId;
   const idMessage = body.idMessage;

   if (!chatId || !idMessage) return;

   const message: ChatMessage = {
      idMessage,
      chatId,
      type: isIncoming ? 'incoming' : 'outgoing',
      typeMessage: body.messageData?.typeMessage ?? 'unknown',
      timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
      textMessage: body.messageData?.textMessageData?.textMessage,
      senderName: body.senderData?.senderName,
   };

   notifyListeners(message);
};

const runLoop = async (): Promise<void> => {
   while (activeConfig) {
      // Фиксируем конфигурацию для конкретного запроса.
      const config = activeConfig;

      try {
         const response = await greenApi.receiveNotification(config);

         const notification = response.data;

         if (!notification) continue;

         try {
            processNotification(notification);
         } finally {
            // Подтверждаем обработку уведомления.
            await greenApi.deleteNotification(config, notification.receiptId);
         }
      } catch (error) {
         console.error('Ошибка получения уведомления:', error);

         // Не создаём бесконечный цикл частых запросов при ошибке.
         await sleep(1000);
      }
   }
};

export const notificationService = {
   subscribe(listener: Listener) {
      listeners.add(listener);

      return () => {
         listeners.delete(listener);
      };
   },

   start(config: GreenApiConfig): void {
      activeConfig = config;

      if (loopPromise) return;

      loopPromise = runLoop().finally(() => {
         loopPromise = null;

         // Если конфигурация появилась снова, пока завершался
         // предыдущий цикл, запускаем один новый цикл.
         if (activeConfig) {
            this.start(activeConfig);
         }
      });
   },

   stop(): void {
      // Цикл завершится после окончания текущего HTTP-запроса.
      activeConfig = null;
   },
};
