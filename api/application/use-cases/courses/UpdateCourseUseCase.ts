import { ICourseRepository, UpdateCourseInput, Course } from '../../ports/ICourseRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class UpdateCourseUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(id: string, input: UpdateCourseInput): Promise<Result<Course, Error>> {
    return this.courseRepository.update(id, input);
  }
}
