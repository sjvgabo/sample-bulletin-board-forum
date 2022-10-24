import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  handleClick: () => void;
};
const EditButton: React.FC<Props> = ({ handleClick }) => {
  return (
    <div>
      <button
        className="bg-slate-400 hover:bg-slate-200 py-1 px-2 rounded-lg my-1 text-sm"
        onClick={handleClick}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default observer(EditButton);
