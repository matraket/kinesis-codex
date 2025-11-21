import { Result } from '../../../shared/types/Result.js';

export type Bonus = {
  id: string;
  code: string;
  name: string;
  description?: string;
  sessionsTotal: number;
  priceTotal?: number | null;
  pricePerSession?: number | null;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BonusFilters = {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export type CreateBonusInput = {
  code: string;
  name: string;
  description?: string;
  sessionsTotal: number;
  priceTotal?: number;
  pricePerSession?: number;
  isActive?: boolean;
};

export type UpdateBonusInput = Partial<CreateBonusInput>;

export interface IBonusRepository {
  listAll(filters: BonusFilters): Promise<Result<{ bonuses: Bonus[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Bonus | null, Error>>;
  findByCode(code: string): Promise<Result<Bonus | null, Error>>;
  create(input: CreateBonusInput): Promise<Result<Bonus, Error>>;
  update(id: string, input: UpdateBonusInput): Promise<Result<Bonus, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
