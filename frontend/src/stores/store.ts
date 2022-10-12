import { createContext, Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import AccountsStore from "./AccountsStore";

import ContentStore from "./ContentStore";

export const tokenCtx = createContext<string>();
@model("bulletin-board/Store")
export default class Store extends Model({
  contentStore: prop<ContentStore>(),
  accountsStore: prop<AccountsStore>(),
  token: prop<string>("").withSetter(),
}) {
  onInit() {
    tokenCtx.setComputed(this, () => this.token);
  }

  @modelFlow
  load = _async(function* (this: Store) {
    yield* _await(this.contentStore.fetchTopics());
    yield* _await(this.accountsStore.reAuthUser());

    if (this.accountsStore.authenticated) {
      this.setToken(this.accountsStore.token);
    }
  });
}
