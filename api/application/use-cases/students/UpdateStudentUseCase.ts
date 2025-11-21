import { IStudentRepository, UpdateStudentInput, Student } from '../../ports/IStudentRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class UpdateStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(id: string, input: UpdateStudentInput): Promise<Result<Student, Error>> {
    return this.studentRepository.update(id, input);
  }
}
