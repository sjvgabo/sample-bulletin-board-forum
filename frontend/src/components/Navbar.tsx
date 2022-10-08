import React from "react";
import { Link } from "react-router-dom";
import UserNav from "./usernav";

const Navbar = () => {
  return (
    <div className="h-1/6 bg-sky-700 flex justify-between p-5">
      {/* Website Title */}
      <div>
        <Link to="/">
          <text className="text-white text-4xl">The Food Forum</text>
        </Link>
      </div>

      {/* User Nav */}
      <div>
        <UserNav />
      </div>
    </div>
  );
};

export default Navbar;
