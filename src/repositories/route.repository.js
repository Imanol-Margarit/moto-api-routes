import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";

const columns = `
  id,
  title,
  region,
  "distanceKm",
  difficulty,
  description,
  "createdAt",
  "updatedAt"
`;

function mapRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    title: row.title,
    region: row.region,
    distanceKm: Number(row.distanceKm),
    difficulty: row.difficulty,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export const routeRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT ${columns} FROM routes ORDER BY "createdAt" DESC`
    );
    return rows.map(mapRow);
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT ${columns} FROM routes WHERE id = $1`,
      [id]
    );
    return mapRow(rows[0]);
  },

  async create(data) {
    const id = randomUUID();
    const { rows } = await pool.query(
      `INSERT INTO routes
        (id, title, region, "distanceKm", difficulty, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${columns}`,
      [
        id,
        data.title,
        data.region,
        data.distanceKm,
        data.difficulty,
        data.description ?? null
      ]
    );
    return mapRow(rows[0]);
  },

  async updateById(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    const columnByField = {
      title: "title",
      region: "region",
      distanceKm: '"distanceKm"',
      difficulty: "difficulty",
      description: "description"
    };

    for (const key of Object.keys(columnByField)) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        fields.push(`${columnByField[key]} = $${index++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`"updatedAt" = NOW()`);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE routes
       SET ${fields.join(", ")}
       WHERE id = $${index}
       RETURNING ${columns}`,
      values
    );
    return mapRow(rows[0]);
  },

  async deleteById(id) {
    const { rows } = await pool.query(
      `DELETE FROM routes WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0] ?? null;
  }
};
