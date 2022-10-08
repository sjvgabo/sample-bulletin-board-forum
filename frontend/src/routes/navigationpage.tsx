import { observer } from "mobx-react";
import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useStore } from "../stores";

const NavigationPage = () => {
  const store = useStore();
  return (
    <div className="h-screen">
      {/* Navigation Bar */}
      <Navbar />
      <Outlet />
    </div>
  );
};

export default observer(NavigationPage);
