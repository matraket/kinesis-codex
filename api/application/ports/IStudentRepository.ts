import { Result } from '../../../shared/types/Result.js';

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StudentFilters = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export type CreateStudentInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: string;
};

export type UpdateStudentInput = Partial<CreateStudentInput>;

export interface IStudentRepository {
  listAll(filters: StudentFilters): Promise<Result<{ students: Student[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Student | null, Error>>;
  findByEmail(email: string): Promise<Result<Student | null, Error>>;
  create(input: CreateStudentInput): Promise<Result<Student, Error>>;
  update(id: string, input: UpdateStudentInput): Promise<Result<Student, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
