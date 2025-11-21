import { Result } from '../../../shared/types/Result.js';

export type Level = {
  id: string;
  code: string;
  name: string;
  description?: string;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LevelFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateLevelInput = {
  code: string;
  name: string;
  description?: string;
  sequence: number;
};

export type UpdateLevelInput = Partial<CreateLevelInput>;

export interface ILevelRepository {
  listAll(filters: LevelFilters): Promise<Result<{ levels: Level[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Level | null, Error>>;
  findByCode(code: string): Promise<Result<Level | null, Error>>;
  create(input: CreateLevelInput): Promise<Result<Level, Error>>;
  update(id: string, input: UpdateLevelInput): Promise<Result<Level, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
