import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import moment from "moment";
import Post from "./Post";

type UpdateProps = {
  date_of_birth: string;
  about_myself: string;
  hometown: string;
  present_location: string;
  gender?: string;
  interests?: string;
  website?: string;
};
@model("bulletinboard/User")
export default class User extends Model({
  pk: prop<number>(),
  username: prop<string>(),
  first_name: prop<string>(),
  last_name: prop<string>(),
  email: prop<string>(),
  date_of_birth: prop<Date>(),
  about_myself: prop<string>(),
  hometown: prop<string>(),
  present_location: prop<string>(),
  gender: prop<string>(""),
  interests: prop<string>(""),
  website: prop<string>(""),
  is_moderator: prop<boolean>(),
  is_administrator: prop<boolean>(),
  is_banned: prop<boolean>(),
  posts: prop<Post[]>(() => []),
  avatar_url: prop<string | undefined>(),
  user_num_posts: prop<number>(),
}) {
  @modelFlow
  partialUpdateUser = _async(function* (
    this: User,
    updateProps: UpdateProps,
    token: string
  ) {
    const updateUserData = {
      ...updateProps,
      date_of_birth: moment(new Date(updateProps.date_of_birth)).format(
        "YYYY-MM-DD"
      ),
    };
    let response: Response;
    response = yield* _await(
      fetch(`${process.env.REACT_APP_API_BASE_LINK}/auth/users/${this.pk}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updateUserData),
      })
    );

    if (response.ok) {
      alert("Account updated");
    } else {
      let error: string;
      error = yield* _await(response.text());
      throw error;
    }
  });

  @modelFlow
  banUser = _async(function* (this: User, token: string) {
    const banData = {
      is_banned: true,
    };
    let response: Response;
    response = yield* _await(
      fetch(
        `${process.env.REACT_APP_API_BASE_LINK}/auth/ban-user/${this.pk}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(banData),
        }
      )
    );

    if (response.ok) {
      alert("Account Banned");
    } else {
      let error: string;
      error = yield* _await(response.text());
      throw error;
    }
  });
}
