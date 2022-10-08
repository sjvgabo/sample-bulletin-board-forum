import { observer } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";

const UserNav = () => {
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
