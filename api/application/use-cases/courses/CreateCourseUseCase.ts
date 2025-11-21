import { ICourseRepository, CreateCourseInput, Course } from '../../ports/ICourseRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateCourseUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(input: CreateCourseInput): Promise<Result<Course, Error>> {
    return this.courseRepository.create(input);
  }
}
