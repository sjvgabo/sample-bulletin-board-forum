import { Model, model, prop } from "mobx-keystone";

@model("bulletinboard/Post")
export default class Post extends Model({
  threadPk: prop<number>(),
  authorPk: prop<number>(),
  message: prop<string>(),
  pk: prop<number>(),
  date_created: prop<Date>(),
  authorUsername: prop<string>(),
  authorAvatarURL: prop<string | undefined>(),
}) {}
