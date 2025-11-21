import { z } from 'zod';

export const createCourseSchema = z.object({
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  programId: z.string().uuid().optional(),
  specialtyId: z.string().uuid().optional(),
  levelId: z.string().uuid().optional(),
  businessModelId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  instructorId: z.string().uuid().optional(),
  scheduleDescription: z.string().optional(),
  priceMonthly: z.number().min(0).optional(),
  status: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  capacity: z.number().int().min(0).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const listCoursesQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional()
});

export type CreateCourseDTO = z.infer<typeof createCourseSchema>;
export type UpdateCourseDTO = z.infer<typeof updateCourseSchema>;
export type ListCoursesQueryDTO = z.infer<typeof listCoursesQuerySchema>;
