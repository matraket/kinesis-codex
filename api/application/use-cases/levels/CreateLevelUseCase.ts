import { ILevelRepository, CreateLevelInput, Level } from '../../ports/ILevelRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateLevelUseCase {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async execute(input: CreateLevelInput): Promise<Result<Level, Error>> {
    return this.levelRepository.create(input);
  }
}
