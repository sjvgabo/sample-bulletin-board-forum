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
          className="bg-green-600 text-white hover:bg-green-400 rounded-lg py-1 px-2"
          onClick={handleLockClick}
        >
          UNLOCK THREAD
        </button>
      ) : (
        <button
          className="bg-red-600 text-white hover:bg-red-400 rounded-lg py-1 px-2"
          onClick={handleLockClick}
        >
          LOCK THREAD
        </button>
      )}
    </div>
  );
};

export default observer(LockThreadButton);
