import { IRoomRepository, RoomFilters, CreateRoomInput, UpdateRoomInput, Room } from '../../application/ports/IRoomRepository.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresRoomRepository implements IRoomRepository {
  async listAll(filters: RoomFilters): Promise<Result<{ rooms: Room[]; total: number }, Error>> {
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

      const countQuery = `SELECT COUNT(*)::int as count FROM rooms ${whereClause}`;
      const dataQuery = `
        SELECT 
          id, code, name, capacity, surface_m2 as "surfaceM2", features,
          created_at as "createdAt", updated_at as "updatedAt"
        FROM rooms
        ${whereClause}
        ORDER BY name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, params),
        pool.query(dataQuery, [...params, limit, offset])
      ]);

      const rooms: Room[] = dataResult.rows.map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        capacity: row.capacity ?? undefined,
        surfaceM2: row.surfaceM2,
        features: row.features,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }));

      return Ok({ rooms, total: countResult.rows[0]?.count ?? 0 });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing rooms'));
    }
  }

  async findById(id: string): Promise<Result<Room | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, capacity, surface_m2 as "surfaceM2", features,
          created_at as "createdAt", updated_at as "updatedAt"
         FROM rooms WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        capacity: row.capacity ?? undefined,
        surfaceM2: row.surfaceM2,
        features: row.features,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding room by id'));
    }
  }

  async findByCode(code: string): Promise<Result<Room | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, capacity, surface_m2 as "surfaceM2", features,
          created_at as "createdAt", updated_at as "updatedAt"
         FROM rooms WHERE code = $1`,
        [code]
      );
      if (result.rows.length === 0) return Ok(null);
      const row = result.rows[0];
      return Ok({
        id: row.id,
        code: row.code,
        name: row.name,
        capacity: row.capacity ?? undefined,
        surfaceM2: row.surfaceM2,
        features: row.features,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding room by code'));
    }
  }

  async create(input: CreateRoomInput): Promise<Result<Room, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();
      await pool.query(
        `INSERT INTO rooms (id, code, name, capacity, surface_m2, features, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          input.code,
          input.name,
          input.capacity ?? null,
          input.surfaceM2 ?? null,
          input.features ?? {},
          now,
          now
        ]
      );

      return Ok({
        id,
        code: input.code,
        name: input.name,
        capacity: input.capacity,
        surfaceM2: input.surfaceM2 ?? null,
        features: input.features ?? {},
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating room'));
    }
  }

  async update(id: string, input: UpdateRoomInput): Promise<Result<Room, Error>> {
    try {
      const pool = getDbPool();
      const existing = await this.findById(id);
      if (existing.isErr()) return existing;
      if (!existing.value) return Err(new Error('Room not found'));

      const current = existing.value;
      const updated: Room = {
        ...current,
        ...input,
        updatedAt: new Date()
      };

      await pool.query(
        `UPDATE rooms
         SET code = $1, name = $2, capacity = $3, surface_m2 = $4, features = $5, updated_at = $6
         WHERE id = $7`,
        [
          updated.code,
          updated.name,
          updated.capacity ?? null,
          updated.surfaceM2 ?? null,
          updated.features ?? {},
          updated.updatedAt,
          id
        ]
      );

      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating room'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting room'));
    }
  }
}
