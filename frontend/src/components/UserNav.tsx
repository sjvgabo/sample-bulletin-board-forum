import { observer } from "mobx-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../stores";
import Avatar from "./Avatar";

const UserNav: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();
  const isAuthenticated = store.accountsStore.authenticated;
  const user = store.accountsStore.authenticated_user;
  const handleClick = () => {
    store.accountsStore.logOutUser();
    navigate("/");
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex gap-5 items-center">
        <div>
          <Avatar link={user.avatar_url} />
        </div>
        <div>
          <div>
            <span className="text-white">Hello, {user?.username}</span>
          </div>
          <Link to={`/profile/${user.pk}`}>
            <div>
              <span className="text-white">Profile Page</span>
            </div>
          </Link>

          <div>
            <button className="text-white" onClick={handleClick}>
              Log Out
            </button>
          </div>
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
