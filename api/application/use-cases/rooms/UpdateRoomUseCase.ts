import { IRoomRepository, UpdateRoomInput, Room } from '../../ports/IRoomRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class UpdateRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(id: string, input: UpdateRoomInput): Promise<Result<Room, Error>> {
    return this.roomRepository.update(id, input);
  }
}
