import { Result } from '../../../shared/types/Result.js';

export type Course = {
  id: string;
  code: string;
  name: string;
  description?: string;
  programId?: string | null;
  specialtyId?: string | null;
  levelId?: string | null;
  businessModelId?: string | null;
  roomId?: string | null;
  instructorId?: string | null;
  scheduleDescription?: string;
  priceMonthly?: number | null;
  status?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  capacity?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseFilters = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export type CreateCourseInput = {
  code: string;
  name: string;
  description?: string;
  programId?: string;
  specialtyId?: string;
  levelId?: string;
  businessModelId?: string;
  roomId?: string;
  instructorId?: string;
  scheduleDescription?: string;
  priceMonthly?: number;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  capacity?: number;
};

export type UpdateCourseInput = Partial<CreateCourseInput>;

export interface ICourseRepository {
  listAll(filters: CourseFilters): Promise<Result<{ courses: Course[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Course | null, Error>>;
  findByCode(code: string): Promise<Result<Course | null, Error>>;
  create(input: CreateCourseInput): Promise<Result<Course, Error>>;
  update(id: string, input: UpdateCourseInput): Promise<Result<Course, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
