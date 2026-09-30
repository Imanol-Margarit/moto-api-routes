import { routeService } from "../services/route.service.js";

export const routeController = {
  async list(_req, res, next) {
    try {
      res.json(await routeService.list());
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      res.json(await routeService.getById(req.params.id));
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const route = await routeService.create(req.body);
      res.status(201).json(route);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      res.json(await routeService.update(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await routeService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
