import { IRoomRepository, CreateRoomInput, Room } from '../../ports/IRoomRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(input: CreateRoomInput): Promise<Result<Room, Error>> {
    return this.roomRepository.create(input);
  }
}
