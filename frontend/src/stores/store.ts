import {
  createContext,
  Model,
  model,
  modelFlow,
  prop,
  _async,
  _await,
} from "mobx-keystone";
import AccountsStore from "./AccountsStore";

import ContentStore from "./ContentStore";

export const tokenCtx = createContext<string>();

@model("bulletin-board/Store")
export default class Store extends Model({
  contentStore: prop<ContentStore>(),
  accountsStore: prop<AccountsStore>(),
}) {

  @modelFlow
  load = _async(function* (this: Store) {
    yield* _await(this.contentStore.fetchTopics());
    yield* _await(this.accountsStore.reAuthUser());

  });
}
