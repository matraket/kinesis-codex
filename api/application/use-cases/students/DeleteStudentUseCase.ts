import { IStudentRepository } from '../../ports/IStudentRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteStudentUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.studentRepository.delete(id);
  }
}
