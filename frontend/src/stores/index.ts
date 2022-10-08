import { registerRootStore } from "mobx-keystone";
import React from "react";

import Store from "./store";
import ContentStore from "./ContentStore";

const StoreContext = React.createContext<Store>({} as Store);

const useStore = () => React.useContext(StoreContext);
const { Provider: StoreProvider } = StoreContext;

const createStore = () => {
  const contentStore = new ContentStore({});
  const store = new Store({
    contentStore,
  });

  registerRootStore(store);

  return store;
};

export { Store, StoreProvider, createStore, useStore };
