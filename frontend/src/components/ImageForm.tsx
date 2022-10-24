import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";
import ErrorMessage from "./ErrorMessage";

type Props = {
  userPk: string;
  handleUser: () => void;
};
const ImageForm: React.FC<Props> = ({ userPk, handleUser }) => {
  const store = useStore();
  const [image, setImage] = useState<File>();
  const [toUpload, setToUpload] = useState(false);
  const [error, setError] = useState<string>();

  const handleFileUpload = async () => {
    setToUpload(false);
    if (image) {
      try {
        await store.accountsStore.uploadAvatar(image);
        handleUser();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  const handleClick = () => {
    setToUpload(true);
  };
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      setImage(e.currentTarget.files[0]);
    }
  };
  const handleRemoveAvatar = async () => {
    try {
      await store.accountsStore.removeAvatar();
      handleUser();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setToUpload(false);
  };

  return toUpload ? (
    <div>
      <input
        className="mb-2 border-2 border-b"
        type="file"
        id="avatar_url"
        name="avatar_url"
        accept="image/*"
        onChange={handleChange}
      />
      <button
        className="bg-slate-600 hover:bg-slate-400 text-white px-2 py-1 rounded disabled:bg-slate-200"
        onClick={handleFileUpload}
        disabled={!image}
      >
        Upload
      </button>
      <button
        className="bg-red-600 hover:bg-red-400 text-white px-2 py-1 mx-1 rounded"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  ) : (
    <div className="flex flex-col">
      <button
        className="bg-slate-400 hover:bg-slate-200 py-1 px-2 rounded-lg my-1 text-sm"
        onClick={handleClick}
      >
        Upload Avatar
      </button>

      {store.accountsStore.authenticated_user?.avatar_url && (
        <button
          className="bg-slate-400 hover:bg-slate-200 py-1 px-2 rounded-lg my-1 text-sm"
          onClick={handleRemoveAvatar}
        >
          Remove Avatar
        </button>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default observer(ImageForm);
