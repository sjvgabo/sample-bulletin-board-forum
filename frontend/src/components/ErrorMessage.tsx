import React from "react";

type Props = {
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return <div className="text-red-500">Error: {message}</div>;
};

export default ErrorMessage;
