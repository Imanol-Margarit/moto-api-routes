// PostgreSQL table shape and validation are defined here for reference.
// Data access is implemented with parameterized SQL in the repository.
export const routeModel = {
  tableName: "routes",
  fields: {
    id: "UUID",
    title: "VARCHAR(120) NOT NULL",
    region: "VARCHAR(80) NOT NULL",
    distanceKm: "NUMERIC(6, 2) NOT NULL CHECK (distanceKm >= 0)",
    difficulty: "VARCHAR(20) NOT NULL CHECK (difficulty IN ('facil', 'media', 'dificil'))",
    description: "VARCHAR(500)",
    createdAt: "TIMESTAMPTZ NOT NULL",
    updatedAt: "TIMESTAMPTZ NOT NULL"
  }
};
