import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  handleDelete: () => void;
};
const DeleteButton: React.FC<Props> = ({ handleDelete }) => {
  return (
    <button
      className="text-xs bg-red-600 text-white p-1 rounded-md"
      onClick={handleDelete}
    >
      DELETE
    </button>
  );
};

export default observer(DeleteButton);
