import { useState, type FormEvent } from 'react';
import styles from './NewChatModal.module.scss';

interface NewChatModalProps {
   onClose: () => void;
   onSubmit: (phone: string) => void;
}

const NewChatModal = ({ onClose, onSubmit }: NewChatModalProps) => {
   const [phone, setPhone] = useState('');

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedPhone = phone.replace(/\D/g, '');

      if (!normalizedPhone) return;

      onSubmit(normalizedPhone);
   };

   return (
      <div className={styles.overlay} onClick={onClose}>
         <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-chat-title"
            onClick={(event) => event.stopPropagation()}
         >
            <h2 id="new-chat-title">Новый чат</h2>
            <p>Введите номер телефона с кодом страны</p>

            <form onSubmit={handleSubmit}>
               <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Например, 491512345678"
                  autoFocus
                  required
               />

               <div className={styles.actions}>
                  <button type="button" onClick={onClose}>
                     Отмена
                  </button>
                  <button type="submit">Открыть чат</button>
               </div>
            </form>
         </section>
      </div>
   );
};

export default NewChatModal;
