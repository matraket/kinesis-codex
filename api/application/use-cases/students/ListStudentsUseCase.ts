import { IStudentRepository, StudentFilters, Student } from '../../ports/IStudentRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListStudentsUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(filters: StudentFilters): Promise<Result<{ students: Student[]; total: number }, Error>> {
    return this.studentRepository.listAll(filters);
  }
}
