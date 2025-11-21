import { IBonusRepository, UpdateBonusInput, Bonus } from '../../ports/IBonusRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class UpdateBonusUseCase {
  constructor(private readonly bonusRepository: IBonusRepository) {}

  async execute(id: string, input: UpdateBonusInput): Promise<Result<Bonus, Error>> {
    return this.bonusRepository.update(id, input);
  }
}
