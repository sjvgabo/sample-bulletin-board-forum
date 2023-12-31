import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import AccountsStore from "./AccountsStore";
import ContentStore from "./ContentStore";

@model("bulletin-board/Store")
export default class Store extends Model({
  contentStore: prop<ContentStore>(),
  accountsStore: prop<AccountsStore>(),
}) {
  @modelFlow
  load = _async(function* (this: Store) {
    yield* _await(this.accountsStore.reAuthUser());
  });
}
