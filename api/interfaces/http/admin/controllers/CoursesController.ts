import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateCourseUseCase,
  UpdateCourseUseCase,
  DeleteCourseUseCase,
  ListCoursesUseCase,
  GetCourseByIdUseCase
} from '../../../../application/use-cases/courses/index.js';
import { createCourseSchema, updateCourseSchema, listCoursesQuerySchema } from '../schemas/courseSchemas.js';

export class CoursesController {
  constructor(
    private readonly listCourses: ListCoursesUseCase,
    private readonly getCourseById: GetCourseByIdUseCase,
    private readonly createCourse: CreateCourseUseCase,
    private readonly updateCourse: UpdateCourseUseCase,
    private readonly deleteCourse: DeleteCourseUseCase
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listCoursesQuerySchema.parse(request.query);
      const result = await this.listCourses.execute(filters);
      if (!result.ok) return reply.status(500).send({ error: result.error?.message });
      return reply.status(200).send({
        data: result.value.courses,
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
      const result = await this.getCourseById.execute(id);
      if (!result.ok) return reply.status(404).send({ error: result.error?.message });
      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = createCourseSchema.parse(request.body);
      const result = await this.createCourse.execute(input);
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
      const input = updateCourseSchema.parse(request.body);
      const result = await this.updateCourse.execute(id, input);
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
      const result = await this.deleteCourse.execute(id);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
