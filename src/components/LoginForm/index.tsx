import { useState } from 'react';
import type z from 'zod';
import { authSchema } from '../../utils/validations';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authStorage } from '../../auth/AuthStorage';
import { greenApi } from '../../api/greenApi';
import styles from './LoginForm.module.scss';

type AuthFormValues = z.infer<typeof authSchema>;

const LoginForm = () => {
   const navigate = useNavigate();
   const [serverError, setServerError] = useState('');

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<AuthFormValues>({
      resolver: zodResolver(authSchema),
      defaultValues: {
         idInstance: '',
         apiTokenInstance: '',
      },
   });

   const onSubmit = async (values: AuthFormValues) => {
      setServerError('');

      try {
         const config = {
            idInstance: values.idInstance,
            apiTokenInstance: values.apiTokenInstance,
         };

         const { data } = await greenApi.getStateInstance(config);

         if (data.stateInstance !== 'authorized') {
            setServerError('Ваш Telegram instance не авторизован в GREEN-API.');
            return;
         }

         authStorage.set(config);
         navigate('/chat', { replace: true });
      } catch {
         setServerError(
            'Не удалось подключиться. Проверьте учётные данные и попробуйте ещё раз.'
         );
      }
   };

   return (
      <form
         className={styles.form}
         onSubmit={handleSubmit(onSubmit)}
         noValidate
      >
         <div className={styles.formFields}>
            <div className={styles.field}>
               <label className={styles.label} htmlFor="idInstance">
                  ID Instance
               </label>
               <input
                  className={styles.input}
                  id="idInstance"
                  type="text"
                  autoComplete="username"
                  placeholder="Введите ID инстанса"
                  aria-invalid={Boolean(errors.idInstance)}
                  aria-describedby={
                     errors.idInstance ? 'idInstance-error' : undefined
                  }
                  {...register('idInstance')}
               />

               {errors.idInstance && (
                  <span id="idInstance-error">{errors.idInstance.message}</span>
               )}
            </div>
            <div className={styles.field}>
               <label className={styles.label} htmlFor="apiTokenInstance">
                  API Token Instance
               </label>
               <input
                  className={styles.input}
                  id="apiTokenInstance"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Введите токен API"
                  aria-invalid={Boolean(errors.apiTokenInstance)}
                  aria-describedby={
                     errors.apiTokenInstance
                        ? 'apiTokenInstance-error'
                        : undefined
                  }
                  {...register('apiTokenInstance')}
               />

               {errors.apiTokenInstance && (
                  <span id="apiTokenInstance-error">
                     {errors.apiTokenInstance.message}
                  </span>
               )}
            </div>
         </div>
         {serverError && <div role="alert">{serverError}</div>}
         <div>
            <button
               className={styles.button}
               type="submit"
               disabled={isSubmitting}
            >
               {isSubmitting ? (
                  <>
                     <span aria-hidden="true" />
                     Проверяем подключение...
                  </>
               ) : (
                  'Подключиться'
               )}
            </button>
         </div>
      </form>
   );
};

export default LoginForm;
