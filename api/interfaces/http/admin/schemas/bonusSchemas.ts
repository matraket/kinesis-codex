import { z } from 'zod';

export const createBonusSchema = z.object({
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  sessionsTotal: z.number().int().min(1),
  priceTotal: z.number().min(0).optional(),
  pricePerSession: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateBonusSchema = createBonusSchema.partial();

export const listBonusesQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z.string().transform((val) => val === 'true').optional(),
  page: z.string().transform((val) => parseInt(val, 10)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
});

export type CreateBonusDTO = z.infer<typeof createBonusSchema>;
export type UpdateBonusDTO = z.infer<typeof updateBonusSchema>;
export type ListBonusesQueryDTO = z.infer<typeof listBonusesQuerySchema>;
