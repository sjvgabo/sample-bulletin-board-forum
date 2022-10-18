import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="bg-slate-200 p-10 h-auto min-h-full ">
      <div className="bg-white w-1/2 p-5 rounded flex flex-col m-auto items-center ">
        <div>
          <span className="block pb-10 text-xl font-semibold">
            Login Account
          </span>
        </div>
          <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
