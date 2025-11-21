import { z } from 'zod';

export const createLevelSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  sequence: z.number().int().min(0)
});

export const updateLevelSchema = createLevelSchema.partial();

export const listLevelsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional()
});

export type CreateLevelDTO = z.infer<typeof createLevelSchema>;
export type UpdateLevelDTO = z.infer<typeof updateLevelSchema>;
export type ListLevelsQueryDTO = z.infer<typeof listLevelsQuerySchema>;
