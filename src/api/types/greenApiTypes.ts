import type { GreenApiMethods } from '../constants/apiMethods';

export type GreenApiMethodType =
   (typeof GreenApiMethods)[keyof typeof GreenApiMethods];

export type MessagePayload = { chatId: string; message: string };

export interface GreenApiConfig {
   idInstance: string;
   apiTokenInstance: string;
}
