import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateRoomUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
  ListRoomsUseCase,
  GetRoomByIdUseCase
} from '../../../../application/use-cases/rooms/index.js';
import { createRoomSchema, updateRoomSchema, listRoomsQuerySchema } from '../schemas/roomSchemas.js';

export class RoomsController {
  constructor(
    private readonly listRooms: ListRoomsUseCase,
    private readonly getRoomById: GetRoomByIdUseCase,
    private readonly createRoom: CreateRoomUseCase,
    private readonly updateRoom: UpdateRoomUseCase,
    private readonly deleteRoom: DeleteRoomUseCase
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listRoomsQuerySchema.parse(request.query);
      const result = await this.listRooms.execute(filters);
      if (!result.ok) return reply.status(500).send({ error: result.error?.message });
      return reply.status(200).send({
        data: result.value.rooms,
        total: result.value.total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20
      });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await this.getRoomById.execute(id);
      if (!result.ok) return reply.status(404).send({ error: result.error?.message });
      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = createRoomSchema.parse(request.body);
      const result = await this.createRoom.execute(input);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(201).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const input = updateRoomSchema.parse(request.body);
      const result = await this.updateRoom.execute(id, input);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await this.deleteRoom.execute(id);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
