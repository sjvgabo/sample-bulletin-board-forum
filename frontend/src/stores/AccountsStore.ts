import localforage from "localforage";
import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import moment from "moment";
import User from "../models/User";

type RegistrationInput = {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  about_myself: string;
  hometown: string;
  present_location: string;
  gender?: string;
  interests?: string;
  website?: string;
};

type LoginDataInput = {
  username: string;
  password: string;
};

// Handles authentication and user management
@model("bulletin-board/AccountsStore")
export default class AccountsStore extends Model({
  authenticated_user: prop<User | undefined>(),
  authenticated: prop<boolean>(false).withSetter(),
  token: prop<string | undefined>(),
}) {
  @modelFlow
  createUser = _async(function* (this: AccountsStore, data: RegistrationInput) {
    const newUser = {
      ...data,
      date_of_birth: moment(new Date(data.date_of_birth)).format("YYYY-MM-DD"),
    };
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/auth/registration/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
      );
    } catch (error) {
      alert("Fetch Error!");
      return;
    }

    if (response.ok) {
      alert("Account successfully created");
      return true;
    } else {
      alert("Error in creating account.");
    }
  });

  @modelFlow
  authUser = _async(function* (this: AccountsStore, loginData: LoginDataInput) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/auth/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        })
      );
    } catch (error) {
      return;
    }

    let data: any;
    try {
      data = yield* _await(response.json());
    } catch (error) {
      alert("Data parsing error");
    }

    if (data.user) {
      alert("Login success");
      yield* _await(
        localforage.setItem(process.env.REACT_APP_TOKEN_KEY as string, data.key)
      );
      yield* _await(
        localforage.setItem(
          process.env.REACT_APP_EXPIRY_KEY as string,
          JSON.stringify(data.expiry)
        )
      );
      this.setAuthenticated(true);
      return true;
    } else {
      alert("Login failed. Wrong password / username");
    }
  });

  @modelFlow
  reAuthUser = _async(function* (this: AccountsStore) {
    let token: string | unknown;
    let expiry: Date | unknown;

    try {
      token = yield* _await(
        localforage.getItem(process.env.REACT_APP_TOKEN_KEY as string)
      );
      expiry = yield* _await(
        localforage.getItem(process.env.REACT_APP_EXPIRY_KEY as string)
      );
    } catch (error) {
      alert("Error in fetching tokens");
      console.log(error);
    }

    if (typeof token === "string" && expiry) {
      this.setAuthenticated(true);
      alert("Successfully re-authorized");
    } else {
      return;
    }
  });

  @modelFlow
  logOutUser = _async(function* (this: AccountsStore) {
    try {
      yield* _await(localforage.clear());
    } catch (error) {
      console.log(error);
    }

    this.setAuthenticated(false);
    this.authenticated_user = undefined;
  });
}
