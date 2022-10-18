import React from "react";
import { useNavigate } from "react-router";
import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate = () => navigate("/login");

  return (
    <div className="bg-slate-200 p-10 h-auto min-h-full flex justify-center">
      <div className="bg-white w-1/2 p-5 rounded flex flex-col items-center">
        <div>
          <span className="block pb-10 text-xl font-semibold">
            Account Registration
          </span>
        </div>
        <RegistrationForm handleNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default RegistrationPage;
