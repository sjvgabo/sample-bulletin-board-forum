import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import * as Yup from "yup";
import Thread from "../models/Thread";
import { useStore } from "../stores";
import MarkdownGuideCard from "./MarkdownGuideCard";

type Props = {
  threadPk: number;
  thread: Thread;
  token: string;
};
const PostForm: React.FC<Props> = ({ threadPk, thread, token }) => {
  const store = useStore();
  const authorPk = store.accountsStore.authenticated_user?.pk as number;
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);

  const handleMarkdownClick = () => {
    setShowMarkdownGuide(!showMarkdownGuide);
  };
  const { handleSubmit, handleChange, values, errors, touched, resetForm } =
    useFormik({
      initialValues: {
        message: "",
      },
      validationSchema: Yup.object({
        message: Yup.string().trim().required("Message must not be empty"),
      }),
      onSubmit: async (values) => {
        await thread.createPost(values.message, threadPk, authorPk, token);
        resetForm();
      },
    });

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <textarea
        className="border-2 h-20 mb-2"
        id="message"
        name="message"
        value={values.message}
        onChange={handleChange}
      />
      {touched.message && errors.message ? (
        <div className="text-red-600 text-sm">{errors.message}</div>
      ) : null}
      <button
        className="bg-slate-400 text-white px-2 py-1 rounded"
        type="submit"
      >
        Comment
      </button>
      <div className="flex flex-col">
        <button
          className="text-center my-3 border-2 border-gray-400 hover:bg-gray-200 rounded-md mx-auto p-2"
          onClick={handleMarkdownClick}
        >
          {showMarkdownGuide ? "Hide Markdown Guide" : "Show Markdown Guide"}
        </button>
        {showMarkdownGuide && <MarkdownGuideCard />}
      </div>
    </form>
  );
};

export default observer(PostForm);
