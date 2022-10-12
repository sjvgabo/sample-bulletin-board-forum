import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import * as Yup from "yup";
import { useStore } from "../stores";

type Props = {
  threadPk: number;
};
const PostForm: React.FC<Props> = ({ threadPk }) => {
  const store = useStore();
  const authorPk = store.accountsStore.authenticated_user?.pk as number;

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Post must not be empty"),
    }),
    onSubmit: async (values) => {
      await store.contentStore.createPost(values.message, threadPk, authorPk);
    },
  });

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input
        className="border-2 h-20 mb-2"
        type="text"
        id="message"
        name="message"
        value={values.message}
        onChange={handleChange}
      />
      <button
        className="bg-slate-400 text-white px-2 py-1 rounded"
        type="submit"
      >
        Comment
      </button>
    </form>
  );
};

export default observer(PostForm);
