import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Board from "./Board";

type UserData = {
  pk: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  date_of_birth: Date,
  about_myself: string,
  hometown: string,
  present_location: string,
  gender: string,
  interests: string,
  website: string,
  is_poster: boolean,
  is_moderator: boolean,
  is_administrator: boolean,
  is_banned: boolean
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
  is_poster: prop<boolean>(),
  is_moderator: prop<boolean>(),
  is_administrator: prop<boolean>(),
  is_banned: prop<boolean>()

}) {
  
}
