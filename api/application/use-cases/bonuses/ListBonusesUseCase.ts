import { IBonusRepository, BonusFilters, Bonus } from '../../ports/IBonusRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListBonusesUseCase {
  constructor(private readonly bonusRepository: IBonusRepository) {}

  async execute(filters: BonusFilters): Promise<Result<{ bonuses: Bonus[]; total: number }, Error>> {
    return this.bonusRepository.listAll(filters);
  }
}
