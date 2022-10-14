import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  handleClick: () => void;
};
const BanButton: React.FC<Props> = ({ handleClick }) => {
  const handleButton = () => {
    handleClick();
  };
  return (
    <div>
      <button
        className="bg-red-200 py-1 px-2 rounded-lg my-1 text-sm"
        onClick={handleButton}
      >
        Ban User
      </button>
    </div>
  );
};

export default observer(BanButton);
