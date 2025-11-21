import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateLevelUseCase,
  UpdateLevelUseCase,
  DeleteLevelUseCase,
  ListLevelsUseCase,
  GetLevelByIdUseCase
} from '../../../../application/use-cases/levels/index.js';
import { createLevelSchema, updateLevelSchema, listLevelsQuerySchema } from '../schemas/levelSchemas.js';

export class LevelsController {
  constructor(
    private readonly listLevels: ListLevelsUseCase,
    private readonly getLevelById: GetLevelByIdUseCase,
    private readonly createLevel: CreateLevelUseCase,
    private readonly updateLevel: UpdateLevelUseCase,
    private readonly deleteLevel: DeleteLevelUseCase
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listLevelsQuerySchema.parse(request.query);
      const result = await this.listLevels.execute(filters);
      if (!result.ok) return reply.status(500).send({ error: result.error?.message });
      return reply.status(200).send({
        data: result.value.levels,
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
      const result = await this.getLevelById.execute(id);
      if (!result.ok) return reply.status(404).send({ error: result.error?.message });
      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = createLevelSchema.parse(request.body);
      const result = await this.createLevel.execute(input);
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
      const input = updateLevelSchema.parse(request.body);
      const result = await this.updateLevel.execute(id, input);
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
      const result = await this.deleteLevel.execute(id);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
