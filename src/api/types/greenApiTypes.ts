import type { GreenApiMethods } from '../constants/apiMethods';

export type GreenApiMethodType =
   (typeof GreenApiMethods)[keyof typeof GreenApiMethods];

export type MessagePayload = {
   chatId: string;
   message: string;
   typingTime: number;
};

export interface GreenApiConfig {
   idInstance: string;
   apiTokenInstance: string;
}

export interface GreenApiNotification {
   receiptId: number;
   body: {
      typeWebhook: string;
      timestamp?: number;
      idMessage?: string;
      senderData?: {
         chatId: string;
         chatName?: string;
         senderName?: string;
      };
      messageData?: {
         typeMessage: string;
         textMessageData?: {
            textMessage: string;
         };
      };
   };
}

export interface CheckAccountResponse {
   exist: boolean;
   chatId: string;
   username?: string;
   phoneNumber?: number;
   fromCache?: boolean;
}
