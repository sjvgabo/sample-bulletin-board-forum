import { observer } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../stores";

const UserNav = () => {
  const store = useStore();
  const isAuthenticated = store.accountsStore.authenticated;
  if (isAuthenticated) {
    return (
      <div>
        <div>
          <span className="text-white">Hello, Sample User</span>
        </div>
        <div>
          <button className="text-white">Log Out</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login">
        <div>
          <span className="text-white">Login</span>
        </div>
      </Link>
      <Link to="/register">
        <div>
          <span className="text-white">Create New Account</span>
        </div>
      </Link>
    </div>
  );
};

export default observer(UserNav);
