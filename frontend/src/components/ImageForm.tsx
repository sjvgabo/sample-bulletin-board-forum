import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useStore } from "../stores";

const ImageForm: React.FC = () => {
  const store = useStore();
  const [image, setImage] = useState<File>();
  const [toUpload, setToUpload] = useState(false);

  const handleFileUpload = async () => {
    setToUpload(false);
    if (image) {
      await store.accountsStore.uploadAvatar(image);
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
        className="bg-slate-400 text-white px-2 py-1 rounded"
        onClick={handleFileUpload}
      >
        Upload
      </button>
    </div>
  ) : (
    <div>
      <button
        className="bg-slate-200 py-1 px-2 rounded-lg my-1 text-sm"
        onClick={handleClick}
      >
        Upload Avatar
      </button>
    </div>
  );
};

export default observer(ImageForm);
