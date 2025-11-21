import { Result } from '../../../shared/types/Result.js';

export type Room = {
  id: string;
  code: string;
  name: string;
  capacity?: number;
  surfaceM2?: number | null;
  features?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RoomFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateRoomInput = {
  code: string;
  name: string;
  capacity?: number;
  surfaceM2?: number | null;
  features?: Record<string, unknown> | null;
};

export type UpdateRoomInput = Partial<CreateRoomInput>;

export interface IRoomRepository {
  listAll(filters: RoomFilters): Promise<Result<{ rooms: Room[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Room | null, Error>>;
  findByCode(code: string): Promise<Result<Room | null, Error>>;
  create(input: CreateRoomInput): Promise<Result<Room, Error>>;
  update(id: string, input: UpdateRoomInput): Promise<Result<Room, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
