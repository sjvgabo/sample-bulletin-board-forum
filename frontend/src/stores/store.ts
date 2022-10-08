import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";

import ContentStore from "./ContentStore";

@model("react-todo/Store")
export default class Store extends Model({
  contentStore: prop<ContentStore>(),
  token: prop<string>(""),
}) {
  @modelFlow
  load = _async(function* (this: Store) {
    yield* _await(this.contentStore.fetchTopics());
    // Next lines causing infinite rerender
    // this.contentStore.topics.forEach(async(topic) => {
    //   await topic.fetchBoards()
    // })
  });
}
