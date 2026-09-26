import axios from 'axios';
import { GreenApiMethods } from './constants/apiMethods';
import type { GreenApiConfig, MessagePayload } from './types/greenApiTypes';

const API_URL = 'https://api.green-api.com';

const getUrl = (config: GreenApiConfig, method: string, path = '') =>
   `${API_URL}/waInstance${config.idInstance}/${method}/${config.apiTokenInstance}${path}`;

export const greenApi = {
   getStateInstance: (config: GreenApiConfig) =>
      axios.get(getUrl(config, GreenApiMethods.STATUS_CHECK)),

   getChats: (config: GreenApiConfig) =>
      axios.get(getUrl(config, GreenApiMethods.GET_CHATS)),

   sendMessage: (config: GreenApiConfig, payload: MessagePayload) =>
      axios.post(getUrl(config, GreenApiMethods.SEND_MESSAGE), payload),

   receiveNotification: (config: GreenApiConfig) =>
      axios.get(getUrl(config, GreenApiMethods.RECEIVE_NOTIFICATION)),

   deleteNotification: (config: GreenApiConfig, receiptId: number) =>
      axios.delete(
         getUrl(config, GreenApiMethods.DELETE_NOTIFICATION, `/${receiptId}`)
      ),
};
