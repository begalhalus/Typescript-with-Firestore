import { Request, Response } from "express";
import response from "../helpers/response";
import firebase from "firebase";
import * as dayjs from "dayjs";
import * as yup from "yup";

const firestore = firebase.firestore();
let validate: any;

class CourseService {
  credential: {
    email: string;
  };
  body: Request["body"];
  params: Request["params"];
  res: Response;
  req: any;

  constructor(req: any, res: Response) {
    this.credential = res.locals.currentUser;
    this.body = req.body;
    this.params = req.params;
    this.res = res;
    this.req = req;
  }

  // Service Api

  getCourse = async () => {
    let course: any, data: any, courseArr: any;

    try {
      course = firestore.collection("course");
      data = await course.get();
      courseArr = [];
    } catch (error) {
      console.log(error + "error");
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (data.empty) {
      return response.failed("", "Data Tidak Ditemukan !", this.res);
    }

    data.forEach((doc) => {
      const array = {
        id: doc.id,
        title: doc.data().title,
        slug: doc.data().slug,
        desc: doc.data().desc,
        imageUrl: doc.data().imageUrl,
        tag: doc.data().tag,
        content: doc.data().content,
        author: doc.data().author,
        course_updated: dayjs
          .unix(doc.data().course_updated.seconds)
          .format("YYYY-MM-DD HH:mm"),
        course_register: dayjs
          .unix(doc.data().course_register.seconds)
          .format("YYYY-MM-DD HH:mm"),
      };
      courseArr.push(array);
    });

    return response.pagination(
      courseArr,
      "Data Ditemukan !",
      this.res,
      this.req
    );
  };

  postCourse = async () => {
    const { title, slug, desc, imageUrl, tag, content } = this.body;

    const schema = yup.object({
      title: yup.string().required(),
      slug: yup.string().required(),
      desc: yup.string().required(),
      imageUrl: yup.string().required(),
      tag: yup.string().required(),
      content: yup.string().required(),
    });

    try {
      validate = await schema.validate(this.body);
    } catch (err) {
      return response.failed(err.errors, "Error !", this.res);
    }

    try {
      let params = {
        title: title,
        slug: slug,
        desc: desc,
        imageUrl: imageUrl,
        tag: tag,
        content: content,
        author: this.credential.email,
        course_updated: firebase.firestore.Timestamp.now(),
        course_register: firebase.firestore.Timestamp.now(),
      };

      await firestore.collection("course").doc().set(params);

      return response.success(params, "Data berhasil ditambahkan !", this.res);
    } catch (error) {
      console.log(error);
      return response.failed("", "Data gagal ditambahkan !", this.res);
    }
  };

  redeemCourse = async () => {
    const schema = yup.object({
      body: yup.object({
        user_id: yup.string().email().required(),
        course_id: yup.string().required(),
      }),
      params: yup.object({
        id: yup.string().required(),
      }),
    });
    const { id } = this.req.params;
    let course: any, data: any, redeem: any, checkedRedeem: any;

    try {
      course = firestore.collection("course").doc(id);
      data = await course.get();
      redeem = firestore.collection("course_redeem").doc(id);
      checkedRedeem = await redeem.get();
    } catch (error) {
      console.log(error + "error");
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (!data.exists) {
      return response.failed("", "Data Course tidak ditemukan !", this.res);
    }

    if (checkedRedeem.exists) {
      return response.failed(
        "",
        "Data Course sudah pernah diambil !",
        this.res
      );
    }

    let params = {
      user_id: this.credential.email,
      course_id: id,
      reedem_register: firebase.firestore.Timestamp.now(),
    };

    try {
      validate = await schema.validate({
        body: params,
        params: this.req.params,
      });
    } catch (err) {
      return response.failed(err.errors, "Error !", this.res);
    }

    let store = await firestore.collection("course_redeem").doc(id).set(params);

    return response.success(store, "Course berhasil diambil !", this.res);
  };

  getDetail = async () => {
    const { id } = this.req.params;
    let course: any, data: any;

    try {
      course = firestore.collection("course").doc(id);
      data = await course.get();
    } catch (error) {
      console.log(error + "error");
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (!data.exists) {
      return response.failed("", "Data Course tidak ditemukan !", this.res);
    }

    let result = {
      id: data.data().id,
      title: data.data().title,
      slug: data.data().slug,
      desc: data.data().desc,
      imageUrl: data.data().imageUrl,
      tag: data.data().tag,
      content: data.data().content,
      author: data.data().author,
      course_updated: dayjs
        .unix(data.data().course_updated.seconds)
        .format("YYYY-MM-DD HH:mm"),
      course_register: dayjs
        .unix(data.data().course_register.seconds)
        .format("YYYY-MM-DD HH:mm"),
    };

    return response.success(result, "Data Ditemukan !", this.res);
  };

  putCourse = async () => {
    const { id } = this.req.params;
    const { title, slug, desc, imageUrl, tag, content } = this.body;
    let course: any, data: any;

    const schema = yup.object({
      body: yup.object({
        title: yup.string().required(),
        slug: yup.string().required(),
        desc: yup.string().required(),
        imageUrl: yup.string().required(),
        tag: yup.string().required(),
        content: yup.string().required(),
      }),
      params: yup.object({
        id: yup.string().required(),
      }),
    });

    try {
      validate = await schema.validate({
        body: this.body,
        params: this.req.params,
      });
    } catch (err) {
      return response.failed(err.errors, "Error !", this.res);
    }

    try {
      let params = {
        title: title,
        slug: slug,
        desc: desc,
        imageUrl: imageUrl,
        tag: tag,
        content: content,
        author: this.credential.email,
        course_updated: firebase.firestore.Timestamp.now(),
      };

      course = firestore.collection("course").doc(id);
      data = await course.get();

      if (!data.exists) {
        return response.failed("", "Data Course tidak ditemukan !", this.res);
      }

      await course.update(params);

      return response.success(params, "Data berhasil diperbarui !", this.res);
    } catch (error) {
      console.log(error);
      return response.failed("", "Data gagal diperbarui !", this.res);
    }
  };

  deleteCourse = async () => {
    const { id } = this.req.params;
    let course: any, data: any;

    try {
      course = firestore.collection("course").doc(id);
      data = await course.get();
    } catch (error) {
      console.log(error + "error");
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (!data.exists) {
      return response.failed("", "Data Course tidak ditemukan !", this.res);
    }

    await firestore.collection("course").doc(id).delete();

    return response.success("", "Data berhasil dihapus !", this.res);
  };
}

export default CourseService;
