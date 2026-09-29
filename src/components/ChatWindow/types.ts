export interface ChatMessage {
   idMessage: string;
   chatId: string;
   type: 'incoming' | 'outgoing';
   typeMessage: string;
   timestamp: number;
   textMessage?: string;
   senderName?: string;
   statusMessage?: string;
}

export interface GetChatHistoryParams {
   chatId: string;
   count?: number;
}
