import { Request, Response } from "express";
import CourseService from "../services/CourseService";

class CourseController {
  static get = async (req: Request, res: Response): Promise<any> => {
    const service: CourseService = new CourseService(req, res);

    try {
      await service.getCourse();
    } catch (error) {
      console.log(error);
    }
  };

  static add = async (req: Request, res: Response): Promise<any> => {
    const service: CourseService = new CourseService(req, res);

    try {
      await service.postCourse();
    } catch (error) {
      console.log(error);
    }
  };

  static detail = async (req: Request, res: Response): Promise<any> => {
    const service: CourseService = new CourseService(req, res);

    try {
      await service.getDetail();
    } catch (error) {
      console.log(error);
    }
  };

  static edit = async (req: Request, res: Response): Promise<any> => {
    const service: CourseService = new CourseService(req, res);

    try {
      await service.putCourse();
    } catch (error) {
      console.log(error);
    }
  };

  static delete = async (req: Request, res: Response): Promise<any> => {
    const service: CourseService = new CourseService(req, res);

    try {
      await service.deleteCourse();
    } catch (error) {
      console.log(error);
    }
  };

  static redeem = async (req: Request, res: Response): Promise<any> => {
    const service: CourseService = new CourseService(req, res);

    try {
      await service.redeemCourse();
    } catch (error) {
      console.log(error);
    }
  };
}

export default CourseController;
