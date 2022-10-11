import React from "react";
import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage: React.FC = () => {
  return (
    <div className="bg-slate-200 p-10 min-h-full h-screen flex justify-center">
      <div className="bg-white w-1/2 p-5 rounded flex flex-col items-center">
        <div>
          <span className="block pb-10 text-xl font-semibold">
            Account Registration
          </span>
        </div>
        <div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
