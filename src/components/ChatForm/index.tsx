import { useState, type FormEvent } from 'react';
import styles from './chatForm.module.scss';

interface MessageFormProps {
   onSend: (message: string) => void;
   disabled?: boolean;
}

const ChatForm = ({ onSend, disabled = false }: MessageFormProps) => {
   const [message, setMessage] = useState('');

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedMessage = message.trim();

      if (!trimmedMessage || disabled) {
         return;
      }

      onSend(trimmedMessage);
      setMessage('');
   };

   return (
      <form className={styles.form} onSubmit={handleSubmit}>
         <input
            type="text"
            className={styles.input}
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
            aria-label="Текст сообщения"
         />

         <button
            className={styles.sendButton}
            type="submit"
            disabled={disabled || !message.trim()}
            aria-label="Отправить"
         >
            <img src="/Send.svg" alt="Send icon" />
         </button>
      </form>
   );
};

export default ChatForm;
