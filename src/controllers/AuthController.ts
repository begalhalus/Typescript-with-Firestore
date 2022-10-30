import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  static login = async (req: Request, res: Response): Promise<any> => {
    const service: AuthService = new AuthService(req, res);

    try {
      await service.postLogin();
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req: Request, res: Response): Promise<any> => {
    const service: AuthService = new AuthService(req, res);

    try {
      await service.postRegister();
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req: Request, res: Response): Promise<any> => {
    const service: AuthService = new AuthService(req, res);

    try {
      await service.getLogout();
    } catch (error) {
      console.log(error);
    }
  };
}

export default AuthController;
