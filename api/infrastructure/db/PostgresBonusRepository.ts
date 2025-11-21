import {
  IBonusRepository,
  BonusFilters,
  CreateBonusInput,
  UpdateBonusInput,
  Bonus
} from '../../application/ports/IBonusRepository.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresBonusRepository implements IBonusRepository {
  async countAll(): Promise<Result<number, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('SELECT COUNT(*)::int as count FROM bonuses');
      return Ok(result.rows[0]?.count ?? 0);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error counting bonuses'));
    }
  }
  async listAll(filters: BonusFilters): Promise<Result<{ bonuses: Bonus[]; total: number }, Error>> {
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
      if (filters.isActive !== undefined) {
        whereClause = whereClause
          ? `${whereClause} AND is_active = $${paramIndex}`
          : `WHERE is_active = $${paramIndex}`;
        params.push(filters.isActive);
        paramIndex++;
      }

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;

      const countQuery = `SELECT COUNT(*)::int as count FROM bonuses ${whereClause}`;
      const dataQuery = `
        SELECT 
          id, code, name, description, sessions_total as "sessionsTotal",
          price_total as "priceTotal", price_per_session as "pricePerSession",
          is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM bonuses
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, params),
        pool.query(dataQuery, [...params, limit, offset])
      ]);

      const bonuses: Bonus[] = dataResult.rows.map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        sessionsTotal: row.sessionsTotal,
        priceTotal: row.priceTotal ? parseFloat(row.priceTotal) : null,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : null,
        isActive: row.isActive ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }));

      return Ok({ bonuses, total: countResult.rows[0]?.count ?? 0 });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing bonuses'));
    }
  }

  async findById(id: string): Promise<Result<Bonus | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, description, sessions_total as "sessionsTotal",
          price_total as "priceTotal", price_per_session as "pricePerSession",
          is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM bonuses WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        sessionsTotal: row.sessionsTotal,
        priceTotal: row.priceTotal ? parseFloat(row.priceTotal) : null,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : null,
        isActive: row.isActive ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding bonus by id'));
    }
  }

  async findByCode(code: string): Promise<Result<Bonus | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, description, sessions_total as "sessionsTotal",
          price_total as "priceTotal", price_per_session as "pricePerSession",
          is_active as "isActive",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM bonuses WHERE code = $1`,
        [code]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description ?? undefined,
        sessionsTotal: row.sessionsTotal,
        priceTotal: row.priceTotal ? parseFloat(row.priceTotal) : null,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : null,
        isActive: row.isActive ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding bonus by code'));
    }
  }

  async create(input: CreateBonusInput): Promise<Result<Bonus, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();
      await pool.query(
        `INSERT INTO bonuses (
          id, code, name, description, sessions_total, price_total, price_per_session, is_active, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )`,
        [
          id,
          input.code,
          input.name,
          input.description ?? null,
          input.sessionsTotal,
          input.priceTotal ?? null,
          input.pricePerSession ?? null,
          input.isActive ?? true,
          now,
          now
        ]
      );

      return Ok({
        id,
        code: input.code,
        name: input.name,
        description: input.description,
        sessionsTotal: input.sessionsTotal,
        priceTotal: input.priceTotal ?? null,
        pricePerSession: input.pricePerSession ?? null,
        isActive: input.isActive ?? true,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating bonus'));
    }
  }

  async update(id: string, input: UpdateBonusInput): Promise<Result<Bonus, Error>> {
    try {
      const existingResult = await this.findById(id);
      if (existingResult.isErr()) return existingResult;
      if (!existingResult.value) return Err(new Error('Bonus not found'));
      const current = existingResult.value;
      const updated: Bonus = {
        ...current,
        ...input,
        description: input.description ?? current.description,
        sessionsTotal: input.sessionsTotal ?? current.sessionsTotal,
        priceTotal: input.priceTotal ?? current.priceTotal,
        pricePerSession: input.pricePerSession ?? current.pricePerSession,
        isActive: input.isActive ?? current.isActive,
        code: input.code ?? current.code,
        name: input.name ?? current.name,
        updatedAt: new Date()
      };

      const pool = getDbPool();
      await pool.query(
        `UPDATE bonuses
         SET code = $1, name = $2, description = $3, sessions_total = $4,
             price_total = $5, price_per_session = $6, is_active = $7, updated_at = $8
         WHERE id = $9`,
        [
          updated.code,
          updated.name,
          updated.description ?? null,
          updated.sessionsTotal,
          updated.priceTotal ?? null,
          updated.pricePerSession ?? null,
          updated.isActive ?? true,
          updated.updatedAt,
          id
        ]
      );

      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating bonus'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM bonuses WHERE id = $1', [id]);
      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting bonus'));
    }
  }
}
