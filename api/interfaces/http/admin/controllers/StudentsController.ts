import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateStudentUseCase,
  UpdateStudentUseCase,
  DeleteStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase
} from '../../../../application/use-cases/students/index.js';
import { createStudentSchema, updateStudentSchema, listStudentsQuerySchema } from '../schemas/studentSchemas.js';

export class StudentsController {
  constructor(
    private readonly listStudents: ListStudentsUseCase,
    private readonly getStudentById: GetStudentByIdUseCase,
    private readonly createStudent: CreateStudentUseCase,
    private readonly updateStudent: UpdateStudentUseCase,
    private readonly deleteStudent: DeleteStudentUseCase
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listStudentsQuerySchema.parse(request.query);
      const result = await this.listStudents.execute(filters);
      if (!result.ok) return reply.status(500).send({ error: result.error?.message });
      return reply.status(200).send({
        data: result.value.students,
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
      const result = await this.getStudentById.execute(id);
      if (!result.ok) return reply.status(404).send({ error: result.error?.message });
      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = createStudentSchema.parse(request.body);
      const result = await this.createStudent.execute(input);
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
      const input = updateStudentSchema.parse(request.body);
      const result = await this.updateStudent.execute(id, input);
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
      const result = await this.deleteStudent.execute(id);
      if (!result.ok) return reply.status(400).send({ error: result.error?.message });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) return reply.status(400).send({ error: error.message });
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
