import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().min(1).max(150),
  lastName: z.string().min(1).max(150),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional()
});

export const updateStudentSchema = createStudentSchema.partial();

export const listStudentsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional()
});

export type CreateStudentDTO = z.infer<typeof createStudentSchema>;
export type UpdateStudentDTO = z.infer<typeof updateStudentSchema>;
export type ListStudentsQueryDTO = z.infer<typeof listStudentsQuerySchema>;
