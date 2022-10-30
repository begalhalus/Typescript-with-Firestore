import { Router } from "express";
import CourseController from "../controllers/CourseController";
import { auth } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", auth, CourseController.get);
router.post("/", auth, CourseController.add);
router.get("/:id", auth, CourseController.detail);
router.put("/:id", auth, CourseController.edit);
router.delete("/:id", auth, CourseController.delete);
router.post("/:id/redeem", auth, CourseController.redeem);

export default router;
