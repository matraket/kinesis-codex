import { IRoomRepository, RoomFilters, Room } from '../../ports/IRoomRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListRoomsUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(filters: RoomFilters): Promise<Result<{ rooms: Room[]; total: number }, Error>> {
    return this.roomRepository.listAll(filters);
  }
}
