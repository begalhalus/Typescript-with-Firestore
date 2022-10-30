import { Request, Response } from "express";

class Handler {
  //Response failed
  static failed = async (values: any, message: string, res: Response) => {
    try {
      var data = {
        status: 400,
        message: message,
        results: {
          data: values || {},
        },
      };
    } catch (error) {
      console.log(error);
    }

    res.send(data);
  };

  //Response Success
  static success = async (values: any, message: string, res: Response) => {
    try {
      var data = {
        status: 200,
        message: message,
        results: {
          data: values || {},
        },
      };
    } catch (error) {
      console.log(error);
    }

    res.send(data);
  };

  //Response validation
  static validation = async (values: any, message: string, res: Response) => {
    try {
      var data = {
        status: 412,
        message: message,
        results: {
          data: values || {},
        },
      };
    } catch (error) {
      console.log(error);
    }

    res.send(data);
  };

  //Response Auth
  static auth = async (values: any, message: string, res: Response) => {
    try {
      var data = {
        status: 401,
        message: message,
        results: {
          data: values || {},
        },
      };
    } catch (error) {
      console.log(error);
    }

    res.send(data);
  };

  //Response file
  static file = async (values: any, message: string, res: Response) => {
    try {
      var data = {
        status: 200,
        message: message,
        results: {
          data: { thumb_url: values[1] ?? values[0], original_url: values[0] },
        },
      };
    } catch (error) {
      console.log(error);
    }

    res.send(data);
  };

  public static sortDate = (datesort: string, values: any): any => {
    if (datesort == "ASC") {
      let sort = values.sort(
        (a, b) => Date.parse(a.course_register) - Date.parse(b.course_register)
      );
      return sort;
    }

    let sort = values.sort(
      (a, b) => Date.parse(b.course_register) - Date.parse(a.course_register)
    );
    return sort;
  };

  //Response Auth
  static pagination = async (
    values: any,
    message: string,
    res: Response,
    req: any
  ) => {
    let limit = parseInt(req.query.limit);
    if (!limit) {
      limit = 10;
    }

    let sort = req.query.sort;

    if (sort) {
      var values = await this.sortDate(sort, values);
    }

    let pageCount = Math.ceil(values.length / limit);
    let page = parseInt(req.query.page);
    let count = Math.ceil(values.length);
    if (!page) {
      page = 1;
    }
    if (page > pageCount) {
      page = pageCount;
    }

    try {
      var data = {
        status: 200,
        message: message,
        results: {
          data: values.slice(page * limit - limit, page * limit),
          pagination: {
            total_data: count,
            total_page: pageCount,
            next_page: pageCount - page++,
          },
        },
      };
    } catch (err) {
      console.log(err);
    }

    res.send(data);
  };
}
export default Handler;
