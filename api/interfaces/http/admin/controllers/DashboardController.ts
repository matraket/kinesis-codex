import { FastifyReply, FastifyRequest } from 'fastify';
import { GetDashboardSummaryUseCase } from '../../../../application/use-cases/admin/getDashboardSummary.js';

export class DashboardController {
  constructor(private readonly getDashboardSummary: GetDashboardSummaryUseCase) {}

  async summary(_request: FastifyRequest, reply: FastifyReply) {
    const summaryResult = await this.getDashboardSummary.execute();

    if (summaryResult.isErr()) {
      return reply.status(500).send({ error: summaryResult.error.message });
    }

    return reply.status(200).send(summaryResult.value);
  }
}
