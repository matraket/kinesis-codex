import { ILevelRepository, LevelFilters, Level } from '../../ports/ILevelRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListLevelsUseCase {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async execute(filters: LevelFilters): Promise<Result<{ levels: Level[]; total: number }, Error>> {
    return this.levelRepository.listAll(filters);
  }
}
