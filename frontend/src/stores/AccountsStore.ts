import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import User from "../models/User";


// Handles authentication and user management
@model("bulletin-board/AccountStore")
export default class AccountsStore extends Model({
  user: prop<User>(),
}) {}
