import { ILevelRepository, UpdateLevelInput, Level } from '../../ports/ILevelRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class UpdateLevelUseCase {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async execute(id: string, input: UpdateLevelInput): Promise<Result<Level, Error>> {
    return this.levelRepository.update(id, input);
  }
}
