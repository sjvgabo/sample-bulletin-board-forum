import { Model, model, prop } from "mobx-keystone";

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
  is_poster: prop<boolean>(),
  is_moderator: prop<boolean>(),
  is_administrator: prop<boolean>(),
  is_banned: prop<boolean>(),
}) {}
