import { IBonusRepository, Bonus } from '../../ports/IBonusRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetBonusByIdUseCase {
  constructor(private readonly bonusRepository: IBonusRepository) {}

  async execute(id: string): Promise<Result<Bonus, Error>> {
    const result = await this.bonusRepository.findById(id);
    if (result.value === null) {
      return { ok: false, error: new Error('Bonus not found'), isOk: () => false, isErr: () => true };
    }
    return result as Result<Bonus, Error>;
  }
}
