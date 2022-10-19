import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  handleLockClick: () => void;
  locked: boolean;
};

const LockThreadButton: React.FC<Props> = ({ handleLockClick, locked }) => {
  return (
    <div>
      {locked ? (
        <button
          className="text-xs bg-green-600 hover:bg-green-400 text-white p-1 rounded-md"
          onClick={handleLockClick}
        >
          UNLOCK THREAD
        </button>
      ) : (
        <button
          className="text-xs bg-red-600 hover:bg-red-400 text-white p-1 rounded-md"
          onClick={handleLockClick}
        >
          LOCK THREAD
        </button>
      )}
    </div>
  );
};

export default observer(LockThreadButton);
