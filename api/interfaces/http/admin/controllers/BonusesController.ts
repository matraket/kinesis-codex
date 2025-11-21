import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateBonusUseCase,
  UpdateBonusUseCase,
  DeleteBonusUseCase,
  ListBonusesUseCase,
  GetBonusByIdUseCase
} from '../../../../application/use-cases/bonuses/index.js';
import { createBonusSchema, updateBonusSchema, listBonusesQuerySchema } from '../schemas/bonusSchemas.js';

export class BonusesController {
  constructor(
    private readonly listBonuses: ListBonusesUseCase,
    private readonly getBonusById: GetBonusByIdUseCase,
    private readonly createBonus: CreateBonusUseCase,
    private readonly updateBonus: UpdateBonusUseCase,
    private readonly deleteBonus: DeleteBonusUseCase
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listBonusesQuerySchema.parse(request.query);
      const result = await this.listBonuses.execute(filters);
      if (!result.ok) return reply.status(500).send({ error: result.error?.message });
      return reply.status(200).send({
        data: result.value.bonuses,
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
      const result = await this.getBonusById.execute(id);
      if (!result.ok) return reply.status(404).send({ error: result.error?.message });
      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = createBonusSchema.parse(request.body);
      const result = await this.createBonus.execute(input);
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
      const input = updateBonusSchema.parse(request.body);
      const result = await this.updateBonus.execute(id, input);
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
      const result = await this.deleteBonus.execute(id);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
