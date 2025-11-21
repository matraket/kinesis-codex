import { IRoomRepository } from '../../ports/IRoomRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.roomRepository.delete(id);
  }
}
