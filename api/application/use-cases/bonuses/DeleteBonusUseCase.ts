import { IBonusRepository } from '../../ports/IBonusRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteBonusUseCase {
  constructor(private readonly bonusRepository: IBonusRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.bonusRepository.delete(id);
  }
}
