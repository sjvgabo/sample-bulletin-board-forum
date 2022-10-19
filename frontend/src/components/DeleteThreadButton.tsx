import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  handleDelete: () => void;
};
const DeleteThreadButton: React.FC<Props> = ({ handleDelete }) => {
  return (
    <button
      className="text-xs bg-red-600 hover:bg-red-400 text-white p-1 rounded-md"
      onClick={handleDelete}
    >
      DELETE
    </button>
  );
};

export default observer(DeleteThreadButton);
