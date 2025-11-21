import { ILevelRepository } from '../../ports/ILevelRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteLevelUseCase {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.levelRepository.delete(id);
  }
}
