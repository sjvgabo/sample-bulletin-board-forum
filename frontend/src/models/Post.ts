import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";

@model("bulletinboard/Post")
export default class Post extends Model({
  threadPk: prop<number>(),
  authorPk: prop<number>(),
  message: prop<string>(),
  pk: prop<number>(),
  date_created: prop<Date>(),
  authorUsername: prop<string>(),
  authorAvatarURL: prop<string | undefined>(),
}) {
  @modelFlow
  fetchAuthorAvatarURL = _async(function* (this: Post) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/auth/users/${this.authorPk}/`
        )
      );
    } catch (error) {
      alert("Error fetching data from the database");
      return;
    }
    let data: any;
    try {
      data = yield* _await(response.json());
    } catch (error) {
      alert("Error parsing data");
      return;
    }
    if (data.avatar_url) {
      this.authorAvatarURL = data.avatar_url;
    }
  });

  onInit() {
    this.fetchAuthorAvatarURL();
  }
}
