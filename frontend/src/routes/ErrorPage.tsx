import React from "react";

type Props = {
  message?: string;
};
const ErrorPage: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex flex-1 justify-center items-center flex-col h-screen">
      <div className="mb-10">
        <span className="text-gray-700 text-6xl">Oops!</span>
      </div>

      {message ? (
        <div>
          <span className="text-gray-500">Error: {message}</span>
        </div>
      ) : (
        <div>
          <span className="text-gray-500">Error: Page not Found!</span>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
