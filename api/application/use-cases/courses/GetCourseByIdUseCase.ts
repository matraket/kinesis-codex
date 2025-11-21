import { ICourseRepository, Course } from '../../ports/ICourseRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetCourseByIdUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<Result<Course, Error>> {
    const result = await this.courseRepository.findById(id);
    if (result.value === null) {
      return { ok: false, error: new Error('Course not found'), isOk: () => false, isErr: () => true };
    }
    return result as Result<Course, Error>;
  }
}
