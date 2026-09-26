import z from 'zod';

export const authSchema = z.object({
   idInstance: z.string().trim().min(1, 'Введите ID Instance'),
   apiTokenInstance: z.string().trim().min(1, 'Введите API Token Instance'),
});
