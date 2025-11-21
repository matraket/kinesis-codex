import { z } from 'zod';

export const createRoomSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  capacity: z.number().int().min(0).optional(),
  surfaceM2: z.number().min(0).optional(),
  features: z.record(z.any()).optional()
});

export const updateRoomSchema = createRoomSchema.partial();

export const listRoomsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional()
});

export type CreateRoomDTO = z.infer<typeof createRoomSchema>;
export type UpdateRoomDTO = z.infer<typeof updateRoomSchema>;
export type ListRoomsQueryDTO = z.infer<typeof listRoomsQuerySchema>;
