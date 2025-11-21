import { IBonusRepository, CreateBonusInput, Bonus } from '../../ports/IBonusRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateBonusUseCase {
  constructor(private readonly bonusRepository: IBonusRepository) {}

  async execute(input: CreateBonusInput): Promise<Result<Bonus, Error>> {
    return this.bonusRepository.create(input);
  }
}
