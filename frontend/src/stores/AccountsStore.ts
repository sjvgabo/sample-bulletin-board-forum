import localforage from "localforage";
import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import moment from "moment";
import Post from "../models/Post";
import { PostData } from "../models/Thread";
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

type UserAPIData = {
  pk: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: Date;
  about_myself: string;
  hometown: string;
  present_location: string;
  gender: string;
  interests: string;
  website: string;
  is_poster: boolean;
  is_moderator: boolean;
  is_administrator: boolean;
  is_banned: boolean;
  user_posts: number[];
  avatar_url: string | null;
};

// Handles authentication and user management
@model("bulletin-board/AccountsStore")
export default class AccountsStore extends Model({
  authenticated_user: prop<UserAPIData | undefined>(),
  currentUser: prop<User | undefined>(),
  currentPosts: prop<Post[]>(() => []),
  authenticated: prop<boolean>(false).withSetter(),
  token: prop<string>(""),
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
      return;
    } else {
      alert("Error in creating account. Recheck values submitted");
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
      yield* _await(
        localforage.setItem(process.env.REACT_APP_TOKEN_KEY as string, data.key)
      );
      yield* _await(
        localforage.setItem(
          process.env.REACT_APP_EXPIRY_KEY as string,
          data.expiry
        )
      );
      yield* _await(
        localforage.setItem(
          process.env.REACT_APP_USER_INFO_KEY as string,
          data.user
        )
      );
      this.setAuthenticated(true);
      this.authenticated_user = data.user;
      this.token = data.key;
      return;
    } else {
      alert("Login failed. Wrong password / username");
    }
  });

  @modelFlow
  reAuthUser = _async(function* (this: AccountsStore) {
    let token: string | unknown;
    let expiry: Date | unknown;
    let userData: UserAPIData | null;

    try {
      token = yield* _await(
        localforage.getItem(process.env.REACT_APP_TOKEN_KEY as string)
      );
      expiry = yield* _await(
        localforage.getItem(process.env.REACT_APP_EXPIRY_KEY as string)
      );
      userData = yield* _await(
        localforage.getItem<UserAPIData>(
          process.env.REACT_APP_USER_INFO_KEY as string
        )
      );
    } catch (error) {
      alert("Error in fetching tokens");
      console.log(error);
      return;
    }

    if (typeof token === "string" && typeof expiry === "string" && userData) {
      if (new Date(expiry) > new Date()) {
        // Token not expired
        this.setAuthenticated(true);
        this.token = token;
        this.authenticated_user = userData;
        return;
      } else {
        // Clear local forage if token is expired
        try {
          yield* _await(localforage.clear());
        } catch (error) {
          alert("Error clearing localforage");
          console.log(error);
          return;
        }
      }
    } else {
      // If there is no data in the localforage
      return;
    }
  });

  @modelFlow
  logOutUser = _async(function* (this: AccountsStore) {
    // Log user out of api
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${this.token}`,
          },
        })
      );
    } catch (error) {
      alert("Error logging user out.");
      return;
    }

    if (!response.ok) {
      alert(`${response.status} Response error. Token invalid.`);
    }

    // Clear local forage
    try {
      yield* _await(localforage.clear());
    } catch (error) {
      alert("Error clearing localforage");
      console.log(error);
    } finally {
      this.setAuthenticated(false);
      this.authenticated_user = undefined;
      this.token = "";
      return;
    }
  });

  @modelFlow
  fetchUser = _async(function* (this: AccountsStore, userPk: number) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/auth/users/${userPk}`)
      );
      if (response.ok) {
        let data: UserAPIData;
        data = yield* _await(response.json());
        this.currentUser = new User({
          ...data
        });
      }
    } catch (error) {}
  });

  @modelFlow
  fetchPosts = _async(function* (
    this: AccountsStore,
    userPk: number,
    pageNumber: number = 1
  ) {
    console.log("fetching posts");

    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/auth/users/${userPk}/posts?page=${pageNumber}`
        )
      );
    } catch (error) {
      console.error(error);
      return;
    }

    let data: any = [];
    try {
      data = yield* _await(response.json());
    } catch (error) {
      console.error(error);
      return;
    }
    this.currentPosts = data.map(
      (post: PostData) =>
        new Post({
          authorPk: post.author,
          pk: post.pk,
          threadPk: post.thread,
          message: post.message,
          date_created: post.date_created,
          authorUsername: post.author_username,
        })
    );
  });
}
