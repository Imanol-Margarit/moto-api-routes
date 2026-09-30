import { routeRepository } from "../repositories/route.repository.js";

const DIFFICULTIES = ["facil", "media", "dificil"];

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(id) {
  // PostgreSQL stores route IDs as UUIDs.
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    throw createError("Invalid route id", 400);
  }
}

function sanitizeInput(data = {}) {
  const allowed = ["title", "region", "distanceKm", "difficulty", "description"];
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => allowed.includes(key))
  );
}

function validateInput(data, { partial = false } = {}) {
  const required = ["title", "region", "distanceKm", "difficulty"];

  if (!partial) {
    for (const field of required) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        throw createError(`${field} is required`, 400);
      }
    }
  }

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim().length === 0 || data.title.trim().length > 120) {
      throw createError("Invalid title", 400);
    }
    data.title = data.title.trim();
  }

  if (data.region !== undefined) {
    if (typeof data.region !== "string" || data.region.trim().length === 0 || data.region.trim().length > 80) {
      throw createError("Invalid region", 400);
    }
    data.region = data.region.trim();
  }

  if (data.distanceKm !== undefined) {
    if (
      typeof data.distanceKm !== "number" ||
      !Number.isFinite(data.distanceKm) ||
      data.distanceKm < 0
    ) {
      throw createError("Invalid distanceKm", 400);
    }
  }

  if (data.difficulty !== undefined) {
    if (typeof data.difficulty !== "string" || !DIFFICULTIES.includes(data.difficulty)) {
      throw createError(`Invalid difficulty (allowed: ${DIFFICULTIES.join(", ")})`, 400);
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== "string" || data.description.length > 500) {
      throw createError("Invalid description", 400);
    }
    data.description = data.description.trim();
  }
}

export const routeService = {
  async list() {
    return routeRepository.findAll();
  },

  async getById(id) {
    validateId(id);
    const route = await routeRepository.findById(id);

    if (!route) {
      throw createError("Route not found", 404);
    }

    return route;
  },

  async create(data) {
    const sanitized = sanitizeInput(data);
    validateInput(sanitized);
    return routeRepository.create(sanitized);
  },

  async update(id, data) {
    validateId(id);
    const sanitized = sanitizeInput(data);
    validateInput(sanitized, { partial: true });

    const route = await routeRepository.updateById(id, sanitized);

    if (!route) {
      throw createError("Route not found", 404);
    }

    return route;
  },

  async remove(id) {
    validateId(id);
    const route = await routeRepository.deleteById(id);

    if (!route) {
      throw createError("Route not found", 404);
    }
  }
};
