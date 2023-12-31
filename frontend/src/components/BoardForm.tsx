import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import * as Yup from "yup";
import getErrorMessage from "../utilities/getErrorMessage";
import ErrorMessage from "./ErrorMessage";

type Props = {
  handleCreateBoard: (name: string, description: string) => Promise<void>;
};
const BoardForm: React.FC<Props> = ({ handleCreateBoard }) => {
  const [error, setError] = useState<string>();
  const { handleSubmit, handleChange, values, errors, touched, resetForm } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
      },
      validationSchema: Yup.object({
        name: Yup.string().trim().required("Name must not be empty"),
        description: Yup.string()
          .trim()
          .required("Description must not be empty"),
      }),
      onSubmit: async (values) => {
        try {
          await handleCreateBoard(values.name, values.description);
          resetForm();
        } catch (err) {
          setError(getErrorMessage(err));
        }
      },
    });

  return (
    <form className="flex flex-col py-10" onSubmit={handleSubmit}>
      <div>Create Board:</div>
      <label>Name</label>
      <input
        className="border-2 h-10 mb-2"
        type="text"
        id="name"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      {touched.name && errors.name ? (
        <div className="text-red-600 text-sm">{errors.name}</div>
      ) : null}
      <label>Description</label>
      <textarea
        className="border-2 mb-2"
        id="description"
        name="description"
        value={values.description}
        onChange={handleChange}
      />
      {touched.description && errors.description ? (
        <div className="text-red-600 text-sm">{errors.description}</div>
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

export default observer(BoardForm);
