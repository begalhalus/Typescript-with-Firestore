import { Request, Response, NextFunction } from "express";
import response from "../helpers/response";
import firebase from "firebase";

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  var user = firebase.auth().currentUser;

  if (!user) {
    return response.auth("", "Required Token", res);
  }

  try {
    if (user) {
      res.locals.currentUser = user;
      return next();
    }

    return response.auth("", "Invalid Token", res);
  } catch (error) {
    return response.failed(error, "Error Token", res);
  }
};
