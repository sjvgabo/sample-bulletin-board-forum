import { observer } from "mobx-react";
import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const NavigationPage = () => {
  return (
    <div className="h-screen">
      {/* Navigation Bar */}
      <Navbar />
      <Outlet />
    </div>
  );
};

export default observer(NavigationPage);
