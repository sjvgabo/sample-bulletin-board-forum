import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import * as Yup from "yup";

type Props = {
  handleCreateBoard: (name: string, description: string) => void;
};
const BoardForm: React.FC<Props> = ({ handleCreateBoard }) => {
  const { handleSubmit, handleChange, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name must not be empty"),
      description: Yup.string().required("Description must not be empty"),
    }),
    onSubmit: async (values) => {
      handleCreateBoard(values.name, values.description);
      resetForm();
    },
  });

  return (
    <form className="flex flex-col py-20 pr-32" onSubmit={handleSubmit}>
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
    </form>
  );
};

export default observer(BoardForm);
