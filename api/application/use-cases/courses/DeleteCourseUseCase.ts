import { ICourseRepository } from '../../ports/ICourseRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteCourseUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.courseRepository.delete(id);
  }
}
