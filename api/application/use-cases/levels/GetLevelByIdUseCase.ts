import { ILevelRepository, Level } from '../../ports/ILevelRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetLevelByIdUseCase {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async execute(id: string): Promise<Result<Level, Error>> {
    const result = await this.levelRepository.findById(id);
    if (result.value === null) {
      return { ok: false, error: new Error('Level not found'), isOk: () => false, isErr: () => true };
    }
    return result as Result<Level, Error>;
  }
}
