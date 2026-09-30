import { Router } from "express";
import { routeController } from "../controllers/route.controller.js";

const router = Router();

router.get("/", routeController.list);
router.get("/:id", routeController.getById);
router.post("/", routeController.create);
router.patch("/:id", routeController.update);
router.delete("/:id", routeController.remove);

export default router;
