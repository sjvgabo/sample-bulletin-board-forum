import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-1 justify-center items-center flex-col h-screen">
      <div className="mb-10">
        <span className="text-gray-700 text-6xl">Oops!</span>
      </div>
      <div>
        <span className="text-gray-500">Error: Page not Found!</span>
      </div>
    </div>
  );
};

export default ErrorPage;
