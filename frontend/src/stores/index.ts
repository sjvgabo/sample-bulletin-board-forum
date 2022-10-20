import { registerRootStore } from "mobx-keystone";
import React from "react";

import AccountsStore from "./AccountsStore";
import ContentStore from "./ContentStore";
import Store from "./store";

const StoreContext = React.createContext<Store>({} as Store);

const useStore = () => React.useContext(StoreContext);
const { Provider: StoreProvider } = StoreContext;

const createStore = () => {
  const contentStore = new ContentStore({
    threads: {},
    boards: {},
    posts: {},
  });
  const accountsStore = new AccountsStore({});
  const store = new Store({
    contentStore,
    accountsStore,
  });

  registerRootStore(store);

  return store;
};

export { Store, StoreProvider, createStore, useStore };
