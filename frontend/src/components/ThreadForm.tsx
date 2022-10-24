import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import * as Yup from "yup";
import Board from "../models/Board";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";
import ErrorMessage from "./ErrorMessage";

type Props = {
  board: Board;
};
const ThreadForm: React.FC<Props> = ({ board }) => {
  const store = useStore();
  const authorPk = store.accountsStore.authenticated_user?.pk as number;
  const [error, setError] = useState<string>();

  const { handleSubmit, handleChange, values, errors, touched, resetForm } =
    useFormik({
      initialValues: {
        title: "",
      },
      validationSchema: Yup.object({
        title: Yup.string().required("Title must not be empty"),
      }),
      onSubmit: async (values) => {
        try {
          await store.contentStore.createThread(
            values.title,
            authorPk,
            board.pk,
            store.accountsStore.token
          );
          resetForm();
        } catch (err) {
          setError(getErrorMessage(err));
        }
      },
    });

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label>Create new thread</label>
      <input
        className="border-2  mb-2"
        type="text"
        id="title"
        name="title"
        placeholder="Title"
        value={values.title}
        onChange={handleChange}
      />
      {touched.title && errors.title ? (
        <div className="text-red-600 text-sm">{errors.title}</div>
      ) : null}
      <button
        className="bg-slate-400 text-white px-2 py-1 rounded"
        type="submit"
      >
        Submit
      </button>
      {error && <ErrorMessage message={error} />}
    </form>
  );
};

export default observer(ThreadForm);
