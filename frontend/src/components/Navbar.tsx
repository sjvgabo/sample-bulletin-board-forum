import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import UserNav from "./UserNav";

const Navbar: React.FC = () => {
  return (
    <div className="h-1/6 bg-sky-700 flex justify-between p-5">
      {/* Website Title */}
      <div>
        <Link to="/">
          <span className="text-white text-4xl">The Food Forum</span>
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
