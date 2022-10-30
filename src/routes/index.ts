import { Router } from "express";
import auth from "./auth";
import course from "./course";

const routes = Router();

routes.use("/auth", auth);
routes.use("/course", course);

export default routes;
