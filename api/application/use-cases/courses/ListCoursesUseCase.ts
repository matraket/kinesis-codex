import { ICourseRepository, CourseFilters, Course } from '../../ports/ICourseRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListCoursesUseCase {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async execute(filters: CourseFilters): Promise<Result<{ courses: Course[]; total: number }, Error>> {
    return this.courseRepository.listAll(filters);
  }
}
