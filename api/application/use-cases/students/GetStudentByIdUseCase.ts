import { IStudentRepository, Student } from '../../ports/IStudentRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetStudentByIdUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(id: string): Promise<Result<Student, Error>> {
    const result = await this.studentRepository.findById(id);
    if (result.value === null) {
      return { ok: false, error: new Error('Student not found'), isOk: () => false, isErr: () => true };
    }
    return result as Result<Student, Error>;
  }
}
