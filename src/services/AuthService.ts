import { Request, Response } from "express";
import response from "../helpers/response";
import firebase from "firebase";
import * as yup from "yup";
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

let validate: any;

class AuthService {
  body: Request["body"];
  params: Request["params"];
  res: Response;
  req: any;

  constructor(req: any, res: Response) {
    this.body = req.body;
    this.params = req.params;
    this.res = res;
    this.req = req;
  }

  // Service Api

  postRegister = async () => {
    const { email, password } = this.body;

    try {
      validate = await schema.validate(this.body);
    } catch (err) {
      return response.failed(err.errors, "Error !", this.res);
    }

    if (validate) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          return response.success(
            "",
            "Anda berhasil mendaftar, silahkan login untuk melanjutkan.",
            this.res
          );
        })
        .catch((error) => {
          if (JSON.stringify(error.code) == '"auth/email-already-in-use"') {
            return response.failed(
              "",
              "Email sudah terdaftar, gunakan email lain !",
              this.res
            );
          }

          return response.failed("", "Data gagal ditambahkan !", this.res);
        });
    }
  };

  postLogin = async () => {
    const { email, password } = this.body;

    try {
      validate = await schema.validate(this.body);
    } catch (err) {
      return response.failed(err.errors, "Error !", this.res);
    }

    if (validate) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          let data = {
            user_id: result.user.email,
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
            phone: result.user.phoneNumber,
            status_email: result.user.emailVerified,
          };

          return response.success(data, "Data Ditemukan !", this.res);
        })
        .catch((error) => {
          console.log(error);
          return response.failed("", "Email atau password salah !", this.res);
        });
    }
  };

  getLogout = async () => {
    firebase
      .auth()
      .signOut()
      .then((result) => {
        return response.success("", "Berhasil logout !", this.res);
      })
      .catch((error) => {
        console.log(error);
        return response.failed("", "Gagal logout !", this.res);
      });
  };
}

export default AuthService;
