import { IRoomRepository, Room } from '../../ports/IRoomRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetRoomByIdUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(id: string): Promise<Result<Room, Error>> {
    const result = await this.roomRepository.findById(id);
    if (result.value === null) {
      return { ok: false, error: new Error('Room not found'), isOk: () => false, isErr: () => true };
    }
    return result as Result<Room, Error>;
  }
}
