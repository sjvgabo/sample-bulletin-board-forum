import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../stores";
import UserNav from "./UserNav";

const Navbar: React.FC = () => {
  const store = useStore();

  const handleClick = () => {
    (async () => {
      await store.contentStore.fetchTopics();
    })();
  };
  return (
    <div className="h-1/6 bg-sky-900 flex justify-between p-5">
      {/* Website Title */}
      <div>
        <Link to="/">
          <div onClick={handleClick}>
            <span className="text-white text-4xl">Forum</span>
          </div>
        </Link>
      </div>

      {/* User Nav */}
      <div>
        <UserNav />
      </div>
    </div>
  );
};

export default observer(Navbar);
