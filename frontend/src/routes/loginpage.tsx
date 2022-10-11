import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="bg-slate-200 p-10 min-h-full h-screen flex justify-center">
      <div className="bg-white w-1/2 p-5 rounded flex flex-col items-center">
        <div>
          <span className="block pb-10 text-xl font-semibold">Login Account</span>
        </div>
        <div>
          <LoginForm />
        </div>
        
        
      </div>
    </div>
  );
};

export default LoginPage;
