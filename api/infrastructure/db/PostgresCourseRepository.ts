import {
  ICourseRepository,
  CourseFilters,
  CreateCourseInput,
  UpdateCourseInput,
  Course
} from '../../application/ports/ICourseRepository.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresCourseRepository implements ICourseRepository {
  async countAll(): Promise<Result<number, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('SELECT COUNT(*)::int as count FROM courses');
      return Ok(result.rows[0]?.count ?? 0);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error counting courses'));
    }
  }
  async listAll(filters: CourseFilters): Promise<Result<{ courses: Course[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const params: any[] = [];
      let paramIndex = 1;
      let whereClause = '';

      if (filters.search) {
        whereClause = `WHERE LOWER(c.code) LIKE $${paramIndex} OR LOWER(c.name) LIKE $${paramIndex}`;
        params.push(`%${filters.search.toLowerCase()}%`);
        paramIndex++;
      }

      if (filters.status) {
        whereClause = whereClause
          ? `${whereClause} AND c.status = $${paramIndex}`
          : `WHERE c.status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;

      const countQuery = `SELECT COUNT(*)::int as count FROM courses c ${whereClause}`;
      const dataQuery = `
        SELECT 
          c.id, c.code, c.name, c.description,
          c.program_id as "programId",
          c.specialty_id as "specialtyId",
          c.level_id as "levelId",
          c.business_model_id as "businessModelId",
          c.room_id as "roomId",
          c.instructor_id as "instructorId",
          c.schedule_description as "scheduleDescription",
          c.price_monthly as "priceMonthly",
          c.status,
          c.start_date as "startDate",
          c.end_date as "endDate",
          c.capacity,
          c.created_at as "createdAt",
          c.updated_at as "updatedAt"
        FROM courses c
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, params),
        pool.query(dataQuery, [...params, limit, offset])
      ]);

      const courses: Course[] = dataResult.rows.map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        programId: row.programId,
        specialtyId: row.specialtyId,
        levelId: row.levelId,
        businessModelId: row.businessModelId,
        roomId: row.roomId,
        instructorId: row.instructorId,
        scheduleDescription: row.scheduleDescription ?? undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : null,
        status: row.status ?? undefined,
        startDate: row.startDate ? new Date(row.startDate) : null,
        endDate: row.endDate ? new Date(row.endDate) : null,
        capacity: row.capacity ?? null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }));

      return Ok({ courses, total: countResult.rows[0]?.count ?? 0 });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing courses'));
    }
  }

  async findById(id: string): Promise<Result<Course | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, description,
          program_id as "programId",
          specialty_id as "specialtyId",
          level_id as "levelId",
          business_model_id as "businessModelId",
          room_id as "roomId",
          instructor_id as "instructorId",
          schedule_description as "scheduleDescription",
          price_monthly as "priceMonthly",
          status,
          start_date as "startDate",
          end_date as "endDate",
          capacity,
          created_at as "createdAt",
          updated_at as "updatedAt"
         FROM courses WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        programId: row.programId,
        specialtyId: row.specialtyId,
        levelId: row.levelId,
        businessModelId: row.businessModelId,
        roomId: row.roomId,
        instructorId: row.instructorId,
        scheduleDescription: row.scheduleDescription ?? undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : null,
        status: row.status ?? undefined,
        startDate: row.startDate ? new Date(row.startDate) : null,
        endDate: row.endDate ? new Date(row.endDate) : null,
        capacity: row.capacity ?? null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding course by id'));
    }
  }

  async findByCode(code: string): Promise<Result<Course | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, description,
          program_id as "programId",
          specialty_id as "specialtyId",
          level_id as "levelId",
          business_model_id as "businessModelId",
          room_id as "roomId",
          instructor_id as "instructorId",
          schedule_description as "scheduleDescription",
          price_monthly as "priceMonthly",
          status,
          start_date as "startDate",
          end_date as "endDate",
          capacity,
          created_at as "createdAt",
          updated_at as "updatedAt"
         FROM courses WHERE code = $1`,
        [code]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        programId: row.programId,
        specialtyId: row.specialtyId,
        levelId: row.levelId,
        businessModelId: row.businessModelId,
        roomId: row.roomId,
        instructorId: row.instructorId,
        scheduleDescription: row.scheduleDescription ?? undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : null,
        status: row.status ?? undefined,
        startDate: row.startDate ? new Date(row.startDate) : null,
        endDate: row.endDate ? new Date(row.endDate) : null,
        capacity: row.capacity ?? null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding course by code'));
    }
  }

  async create(input: CreateCourseInput): Promise<Result<Course, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();
      await pool.query(
        `INSERT INTO courses (
          id, code, name, description, program_id, specialty_id, level_id, business_model_id, room_id, instructor_id,
          schedule_description, price_monthly, status, start_date, end_date, capacity, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18
        )`,
        [
          id,
          input.code,
          input.name,
          input.description ?? null,
          input.programId ?? null,
          input.specialtyId ?? null,
          input.levelId ?? null,
          input.businessModelId ?? null,
          input.roomId ?? null,
          input.instructorId ?? null,
          input.scheduleDescription ?? null,
          input.priceMonthly ?? null,
          input.status ?? null,
          input.startDate ?? null,
          input.endDate ?? null,
          input.capacity ?? null,
          now,
          now
        ]
      );

      return Ok({
        id,
        code: input.code,
        name: input.name,
        description: input.description,
        programId: input.programId,
        specialtyId: input.specialtyId,
        levelId: input.levelId,
        businessModelId: input.businessModelId,
        roomId: input.roomId,
        instructorId: input.instructorId,
        scheduleDescription: input.scheduleDescription,
        priceMonthly: input.priceMonthly ?? null,
        status: input.status,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        capacity: input.capacity ?? null,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating course'));
    }
  }

  async update(id: string, input: UpdateCourseInput): Promise<Result<Course, Error>> {
    try {
      const existingResult = await this.findById(id);
      if (existingResult.isErr()) return existingResult;
      if (!existingResult.value) return Err(new Error('Course not found'));

      const current = existingResult.value;
      const updated: Course = {
        ...current,
        ...input,
        description: input.description ?? current.description,
        programId: input.programId ?? current.programId,
        specialtyId: input.specialtyId ?? current.specialtyId,
        levelId: input.levelId ?? current.levelId,
        businessModelId: input.businessModelId ?? current.businessModelId,
        roomId: input.roomId ?? current.roomId,
        instructorId: input.instructorId ?? current.instructorId,
        scheduleDescription: input.scheduleDescription ?? current.scheduleDescription,
        priceMonthly: input.priceMonthly ?? current.priceMonthly,
        status: input.status ?? current.status,
        startDate: input.startDate ?? current.startDate,
        endDate: input.endDate ?? current.endDate,
        capacity: input.capacity ?? current.capacity,
        updatedAt: new Date()
      };

      const pool = getDbPool();
      await pool.query(
        `UPDATE courses
         SET code = $1, name = $2, description = $3,
             program_id = $4, specialty_id = $5, level_id = $6,
             business_model_id = $7, room_id = $8, instructor_id = $9,
             schedule_description = $10, price_monthly = $11, status = $12,
             start_date = $13, end_date = $14, capacity = $15, updated_at = $16
         WHERE id = $17`,
        [
          updated.code,
          updated.name,
          updated.description ?? null,
          updated.programId ?? null,
          updated.specialtyId ?? null,
          updated.levelId ?? null,
          updated.businessModelId ?? null,
          updated.roomId ?? null,
          updated.instructorId ?? null,
          updated.scheduleDescription ?? null,
          updated.priceMonthly ?? null,
          updated.status ?? null,
          updated.startDate ?? null,
          updated.endDate ?? null,
          updated.capacity ?? null,
          updated.updatedAt,
          id
        ]
      );

      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating course'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM courses WHERE id = $1', [id]);
      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting course'));
    }
  }
}
