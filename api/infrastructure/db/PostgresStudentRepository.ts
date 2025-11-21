import {
  IStudentRepository,
  StudentFilters,
  CreateStudentInput,
  UpdateStudentInput,
  Student
} from '../../application/ports/IStudentRepository.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresStudentRepository implements IStudentRepository {
  async countAll(): Promise<Result<number, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('SELECT COUNT(*)::int as count FROM students');
      return Ok(result.rows[0]?.count ?? 0);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error counting students'));
    }
  }
  async listAll(filters: StudentFilters): Promise<Result<{ students: Student[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const params: any[] = [];
      let paramIndex = 1;
      let whereClause = '';

      if (filters.search) {
        whereClause = `WHERE LOWER(first_name) LIKE $${paramIndex} OR LOWER(last_name) LIKE $${paramIndex} OR LOWER(email) LIKE $${paramIndex}`;
        params.push(`%${filters.search.toLowerCase()}%`);
        paramIndex++;
      }

      if (filters.status) {
        whereClause = whereClause
          ? `${whereClause} AND status = $${paramIndex}`
          : `WHERE status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;

      const countQuery = `SELECT COUNT(*)::int as count FROM students ${whereClause}`;
      const dataQuery = `
        SELECT
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          phone,
          status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM students
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, params),
        pool.query(dataQuery, [...params, limit, offset])
      ]);

      const students: Student[] = dataResult.rows.map((row: any) => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        status: row.status ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }));

      return Ok({ students, total: countResult.rows[0]?.count ?? 0 });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing students'));
    }
  }

  async findById(id: string): Promise<Result<Student | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          phone,
          status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM students WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        status: row.status ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding student by id'));
    }
  }

  async findByEmail(email: string): Promise<Result<Student | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          phone,
          status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM students WHERE LOWER(email) = LOWER($1)`,
        [email]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        status: row.status ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding student by email'));
    }
  }

  async create(input: CreateStudentInput): Promise<Result<Student, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();
      await pool.query(
        `INSERT INTO students (id, first_name, last_name, email, phone, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, input.firstName, input.lastName, input.email ?? null, input.phone ?? null, input.status ?? null, now, now]
      );
      return Ok({
        id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        status: input.status,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating student'));
    }
  }

  async update(id: string, input: UpdateStudentInput): Promise<Result<Student, Error>> {
    try {
      const existingResult = await this.findById(id);
      if (existingResult.isErr()) return existingResult;
      if (!existingResult.value) return Err(new Error('Student not found'));
      const current = existingResult.value;
      const updated: Student = {
        ...current,
        ...input,
        firstName: input.firstName ?? current.firstName,
        lastName: input.lastName ?? current.lastName,
        updatedAt: new Date()
      };
      const pool = getDbPool();
      await pool.query(
        `UPDATE students
         SET first_name = $1, last_name = $2, email = $3, phone = $4, status = $5, updated_at = $6
         WHERE id = $7`,
        [
          updated.firstName,
          updated.lastName,
          updated.email ?? null,
          updated.phone ?? null,
          updated.status ?? null,
          updated.updatedAt,
          id
        ]
      );
      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating student'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM students WHERE id = $1', [id]);
      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting student'));
    }
  }
}
