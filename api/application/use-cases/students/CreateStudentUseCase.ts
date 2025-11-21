import { IStudentRepository, CreateStudentInput, Student } from '../../ports/IStudentRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: CreateStudentInput): Promise<Result<Student, Error>> {
    return this.studentRepository.create(input);
  }
}
