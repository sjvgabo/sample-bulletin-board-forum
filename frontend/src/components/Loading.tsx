import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" />
    </div>
  );
};
