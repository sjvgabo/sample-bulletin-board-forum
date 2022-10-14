import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  handleDelete: () => void;
};
const DeleteButton: React.FC<Props> = ({ handleDelete }) => {
  return (
    <button
      className="text-xs bg-red-600 text-gray-300 rounded-md"
      onClick={handleDelete}
    >
      DELETE
    </button>
  );
};

export default observer(DeleteButton);
