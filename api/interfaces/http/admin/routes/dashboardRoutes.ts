import { FastifyInstance } from 'fastify';
import { DashboardController } from '../controllers/DashboardController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerDashboardRoutes(fastify: FastifyInstance, controller: DashboardController) {
  fastify.get('/dashboard', {
    preHandler: adminAuthMiddleware,
    handler: controller.summary.bind(controller),
  });
}
