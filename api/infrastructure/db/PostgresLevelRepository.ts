import { ILevelRepository, LevelFilters, CreateLevelInput, UpdateLevelInput, Level } from '../../application/ports/ILevelRepository.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresLevelRepository implements ILevelRepository {
  async listAll(filters: LevelFilters): Promise<Result<{ levels: Level[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const params: any[] = [];
      let paramIndex = 1;
      let whereClause = '';

      if (filters.search) {
        whereClause = `WHERE LOWER(code) LIKE $${paramIndex} OR LOWER(name) LIKE $${paramIndex}`;
        params.push(`%${filters.search.toLowerCase()}%`);
        paramIndex++;
      }

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;

      const countQuery = `SELECT COUNT(*)::int as count FROM levels ${whereClause}`;
      const dataQuery = `
        SELECT id, code, name, description, sequence, created_at as "createdAt", updated_at as "updatedAt"
        FROM levels
        ${whereClause}
        ORDER BY sequence, name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, params),
        pool.query(dataQuery, [...params, limit, offset])
      ]);

      const levels: Level[] = dataResult.rows.map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        sequence: row.sequence,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }));

      return Ok({ levels, total: countResult.rows[0]?.count ?? 0 });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing levels'));
    }
  }

  async findById(id: string): Promise<Result<Level | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT id, code, name, description, sequence, created_at as "createdAt", updated_at as "updatedAt"
         FROM levels WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        sequence: row.sequence,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding level by id'));
    }
  }

  async findByCode(code: string): Promise<Result<Level | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT id, code, name, description, sequence, created_at as "createdAt", updated_at as "updatedAt"
         FROM levels WHERE code = $1`,
        [code]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        sequence: row.sequence,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding level by code'));
    }
  }

  async create(input: CreateLevelInput): Promise<Result<Level, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();
      await pool.query(
        `INSERT INTO levels (id, code, name, description, sequence, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, input.code, input.name, input.description ?? null, input.sequence, now, now]
      );
      return Ok({
        id,
        code: input.code,
        name: input.name,
        description: input.description,
        sequence: input.sequence,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating level'));
    }
  }

  async update(id: string, input: UpdateLevelInput): Promise<Result<Level, Error>> {
    try {
      const pool = getDbPool();
      const existing = await this.findById(id);
      if (existing.isErr()) return existing;
      if (!existing.value) return Err(new Error('Level not found'));

      const current = existing.value;
      const updated: Level = {
        ...current,
        ...input,
        description: input.description ?? current.description,
        code: input.code ?? current.code,
        name: input.name ?? current.name,
        sequence: input.sequence ?? current.sequence,
        updatedAt: new Date()
      };

      await pool.query(
        `UPDATE levels 
         SET code = $1, name = $2, description = $3, sequence = $4, updated_at = $5
         WHERE id = $6`,
        [updated.code, updated.name, updated.description ?? null, updated.sequence, updated.updatedAt, id]
      );

      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating level'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM levels WHERE id = $1', [id]);
      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting level'));
    }
  }
}
