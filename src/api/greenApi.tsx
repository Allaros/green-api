import axios from 'axios';
import { GreenApiMethods } from './constants/apiMethods';
import type {
   CheckAccountResponse,
   GreenApiConfig,
   GreenApiNotification,
   MessagePayload,
} from './types/greenApiTypes';
import type {
   ChatMessage,
   GetChatHistoryParams,
} from '../components/ChatWindow/types';

const API_URL = 'https://api.green-api.com';

const getUrl = (config: GreenApiConfig, method: string, path = '') =>
   `${API_URL}/waInstance${config.idInstance}/${method}/${config.apiTokenInstance}${path}`;

export const greenApi = {
   getStateInstance: (config: GreenApiConfig) =>
      axios.get(getUrl(config, GreenApiMethods.STATUS_CHECK)),

   getChats: (config: GreenApiConfig) =>
      axios.get(getUrl(config, GreenApiMethods.GET_CHATS)),

   getChatHistory: async (
      config: GreenApiConfig,
      { chatId, count = 100 }: GetChatHistoryParams
   ): Promise<ChatMessage[]> => {
      const response = await axios.post<ChatMessage[]>(
         getUrl(config, GreenApiMethods.GET_CHAT_HISTORY),
         { chatId, count }
      );

      return response.data;
   },

   sendMessage: (config: GreenApiConfig, payload: MessagePayload) =>
      axios.post(getUrl(config, GreenApiMethods.SEND_MESSAGE), payload),

   receiveNotification: (config: GreenApiConfig) =>
      axios.get<GreenApiNotification | null>(
         getUrl(config, GreenApiMethods.RECEIVE_NOTIFICATION),
         { params: { receiveTimeout: 5 } }
      ),

   deleteNotification: (config: GreenApiConfig, receiptId: number) =>
      axios.delete(
         getUrl(config, GreenApiMethods.DELETE_NOTIFICATION, `/${receiptId}`)
      ),

   checkAccount: async (
      config: GreenApiConfig,
      phoneNumber: number
   ): Promise<CheckAccountResponse> => {
      const response = await axios.post<CheckAccountResponse>(
         getUrl(config, GreenApiMethods.CHECK_ACCOUNT),
         { phoneNumber }
      );

      return response.data;
   },
};
